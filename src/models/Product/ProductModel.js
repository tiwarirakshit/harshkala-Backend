const mongoose = require("mongoose");

// NAME
// SLUG
// DESCRIPTION
// DIMENSIONS
// COLOR
// MATERIAL
// COUNTRY OF ORIGIN
// ADDITIONAL INFO
// PRICE
// CATEGORY
// QUANTITY
// SHIPPING
// TRENDING

//create schema
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug:{
            type:String,
            required:true,
            lowercase:true,
        },
        description:{
            type:String,
            required:true,
        },
        summary:{
            type:String,
        },
        dimensions:{
            type:String,
        },
        color:{
            type:String,
        },
        material:{
            type:String,
        },
        countryoforigin:{
            type:String,
        },
        additionalinfo:{
            type:String,
        },
        discountprice:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true,
        },
        parentcategory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true,
        },
        childcategory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        images:{
            type:JSON,
        },
        trending:{
            type:Boolean,
            default:false,
        },
        tags:{
            type:String,
        },
        haveVariants:{
            type:Boolean,
            default:false,
        },
        havePersonalization:{
            type:Boolean,
        },
        personalizationType:{
            type:String,
        },
        variants:[
            {
                attribute:{
                    type:String,
                },
                price:{
                    type:Number,
                },
                discountprice:{
                    type:Number,
                },
                quantity:{
                    type:Number,
                },
                name:{
                    type:String,
                },
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

//Compile schema into model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
