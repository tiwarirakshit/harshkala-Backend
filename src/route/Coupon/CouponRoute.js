const express = require("express");
const { createCouponCtrl, deleteCouponCtrl, getCouponCtrl, checkCouponCtrl } = require("../../controller/Coupon/CouponController");
const router = express.Router();

router.post('/create-coupon',createCouponCtrl);
router.post('/delete-coupon',deleteCouponCtrl);
router.post('/get-coupon',getCouponCtrl);
router.post('/check-coupon',checkCouponCtrl);

module.exports = router; 