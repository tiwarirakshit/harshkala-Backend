const express = require("express");
const { checkoutPayment, verifyPayment } = require("../../controller/Payment/PaymentController");
const router = express.Router();
require('dotenv').config();

router.post('/checkout', checkoutPayment);
router.post('/verify-payment',verifyPayment);

module.exports = router; 