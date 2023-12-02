var express = require('express');
const { getAllcourstData,getSinglecourtData,dayWiseTimeSlot,getMybookingsData } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authorization');
var router = express.Router();

/* GET users listing. */
router.get('/getAllcourstData',userAuth,getAllcourstData)
router.get('/getSinglecourtData',userAuth,getSinglecourtData)
router.get('/dayWiseTimeSlot',userAuth,dayWiseTimeSlot)
router.get('/getMybookingsData',userAuth,getMybookingsData)

module.exports = router;
