const Coupon = require("../../models/Coupon/CouponModel");

exports.createCouponCtrl = async (req, res) => {
    try {
        const { name, type, discount, description,minPurchase,minProducts } = req.body;
        Coupon.create({
            name,
            type,
            description,
            discount,
            minPurchase,
            minProducts,
        }).then((couponCreated) => {
            return res.status(200).json({
                message: "Category Deleted Successfully",
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.checkCouponCtrl = async (req, res) => {
    try {
        const {name,price,items} = req.body;
        var sent = false;
        const coupon = await Coupon.findOne({name});
        if(coupon){
            if(price < coupon?.minPurchase){
                sent=true;
                return res.status(200).json({
                    valid:false,
                    message:`Add ₹ ${coupon?.minPurchase - price} more to apply`
                })
            }else if(items < coupon?.minProducts){
                sent=true;
                return res.status(200).json({
                    valid:false,
                    message:`Add ${coupon?.minProducts - items} more items to apply`
                })
            }
        }
        if(!sent){
            console.log('here');
            console.log(coupon,'cpn');
            return res.status(200).json({
                valid:true,
                discount:coupon?.discount,
                type:coupon?.type,
                minPurchase:coupon?.minPurchase,
                minProducts:coupon?.minProducts,
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.getCouponCtrl = async (req, res) => {
    try {
        const {skip} = req.body;
        const couponFound = await Coupon.find({}).skip(10 * skip).limit(10);
        const coupons = await Coupon.find({});
        return res.status(200).json({
            coupon:couponFound,
            totalcoupons:coupons.length,
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteCouponCtrl = async (req, res) => {
    try {
        const { cid } = req.params;
        await Coupon.findByIdAndDelete(cid)
        return res.status(200).json({
            message: "Coupon Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}