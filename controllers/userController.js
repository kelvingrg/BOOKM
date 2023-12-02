const COURT_SHEDULES = require("../Models/courtSchedules");
const COURTS = require("../Models/courtSchema");
const ObjectId = require("mongoose").Types.ObjectId;

const getAllcourstData = (req, res) => {
  COURTS.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
const getSinglecourtData = async (req, res) => {
  try {
    const result = await COURTS.findOne({ _id: req.query.courtId });
    res.status(200).json(result);
  } catch (error) {}
};
const dayWiseTimeSlot = (req, res) => {
  let currentHour = new Date(req.query.date).getHours();
  let currentDate = new Date(new Date(req.query.date).setUTCHours(0, 0, 0, 0));
  COURT_SHEDULES.aggregate([
    {
      $match: {
        courtId: new ObjectId(req.query.courtId),
        date: currentDate,
        "slot.id": { $gt: currentHour + 1 },
      },
    },
    {
      $lookup: {
        from: "courts",
        localField: "courtId",
        foreignField: "_id",
        as: "court",
      },
    },
    {
      $project: {
        court: { $arrayElemAt: ["$court", 0] },
        _id: 1,
        date: 1,
        slot: 1,
        cost: 1,
        bookedBy: 1,
      },
    },
  ])
    .then((response) => {
      console.log(response, "response");
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
const getMybookingsData = (req, res) => {
  const currentDate = new Date(); // date
  const slotHour = currentDate.getHours(); // slotid/hour
  currentDate.setUTCHours(0, 0, 0, 0);

  COURT_SHEDULES.aggregate([
    {
      $match: {
        bookedBy: new ObjectId(req.userId),
        $expr: {
          $or: [
            { $gt: ["$date", currentDate] },
            {
              $and: [
                { $eq: ["$date", currentDate] },
                { $gte: ["$slot.id", slotHour] },
              ],
            },
          ],
        },
      },
    },
    {
      $lookup:{
        from:'courts',
        localField:'courtId',
        foreignField:'_id',
        as:'courts'  
      }
    },
    // {...
// courts:[{}]
    // }
    {
      $project:{
        _id:1,
        date:1,
        slot:1,
        courtData:{$arrayElemAt:['$courts',0]}
      }
    }
  ]).then((response)=>{
    console.log(response)
    res.status(200).json(response)
  })
};
module.exports = {
  getAllcourstData,
  getSinglecourtData,
  dayWiseTimeSlot,
  getMybookingsData,
};
