const mongoose = require('mongoose');

const saveForLaterSchema = new mongoose.Schema({
    pid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    uid:{
        type:String,
    }
})

const SaveForLater = mongoose.model("SaveForLater", saveForLaterSchema);
module.exports = SaveForLater;
