const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentid: {
        type: String
    },
    orderid: {
        type: String
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',                   //referenec to user
    }
})


module.exports = mongoose.model("Order", orderSchema);