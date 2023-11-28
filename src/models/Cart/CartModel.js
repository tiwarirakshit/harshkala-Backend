const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true,
    },
    productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
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

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
