const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    type:{
        type:String,
    },
    discount:{
        type:String,
    },
    minPurchase:{
        type:Number,
    },
    minProducts:{
        type:Number,
    }
},
{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
})

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
