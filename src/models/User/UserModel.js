const mongoose = require("mongoose");

//create schema
const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
        },
        email: {
            type: String,
        },        
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        address: {
            type: String,
        },
        password: {
            type: String,
        },
        phone: {
            type: Number,
        },
        isAdmin:{
            type:Boolean,
        },
        googleid:{
            type:String,
        },
        secret:{
            type:String,
        },
        avatar:{
            type:String,
        },
        usertype:{
            type:String,
        },
        zipcode:{
            type:String,
        },
        country:{
            type:String,
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
    }
);

//Compile schema into model
const User = mongoose.model("User", userSchema);

module.exports = User;
