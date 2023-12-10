const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomeExpense = new Schema({
    desc: {
        type: String,
        required: true,
    },
    amt: {
        type: mongoose.Types.Decimal128,
        required: true,
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

module.exports = mongoose.model("Income", incomeExpense);