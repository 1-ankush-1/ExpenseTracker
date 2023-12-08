const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    ispremiumuser: {
        type: Boolean,
        required: true,
        enum: [true, false],
        default: false
    },
    totalexpenses: {
        type: mongoose.Types.Decimal128,
        required: true,
        default: 0
    },
    totalincome: {
        type: mongoose.Types.Decimal128,
        required: true,
        default: 0
    }
})


module.exports = mongoose.model("User", userSchema);
