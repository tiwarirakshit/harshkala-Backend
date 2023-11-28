const mongoose = require("mongoose");

//create schema
const giftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        dimensions: {
            type: String,
        },
        color: {
            type: String,
        },
        material: {
            type: String,
        },
        countryoforigin: {
            type: String,
        },
        additionalinfo: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        images: {
            type: JSON,
        },
        tags: {
            type: String,
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
const GiftBox = mongoose.model("Gift", giftSchema);
module.exports = GiftBox;
