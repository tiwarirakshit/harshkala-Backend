const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:false,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    images:{
        type:JSON,
    },
    parentid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
