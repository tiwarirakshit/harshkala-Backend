const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
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

const Attribute = mongoose.model("Attribute",attributeSchema);
module.exports = Attribute;
