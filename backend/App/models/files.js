const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileurl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',                   //referenec to user
        required: true
    }
})


module.exports = mongoose.model("File", fileSchema);