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
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',                   //referenec to user
        required: true
    }
})

module.exports = mongoose.model("Income", incomeExpense);