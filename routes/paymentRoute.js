var express = require('express');
const { userAuth } = require('../middlewares/authorization');
const {orders,paymentSuccess}=require('../controllers/paymentController')
var router = express.Router();
router.post('/orders',userAuth,orders)
router.post('/success',userAuth,paymentSuccess)



module.exports=router