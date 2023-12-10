const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    catogary: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    amt: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("Expense", expenseSchema);