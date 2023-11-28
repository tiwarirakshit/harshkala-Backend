const mongoose = require('mongoose');

const homeCategorySchema = new mongoose.Schema({
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
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

const HomeCategory = mongoose.model("HomeCategory", homeCategorySchema);
module.exports = HomeCategory;
