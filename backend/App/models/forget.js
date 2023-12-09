const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ForgetPasswordSchema = new Schema({
    isactive: {
        type: Boolean
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("ForgetPassword", ForgetPasswordSchema);