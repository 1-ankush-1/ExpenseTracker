const Razorpay = require('razorpay');
const { Order, User } = require("../model/index.js");

exports.buyPremium = (req, res, next) => {

    try {
        //new object of razorpay
        var payrazor = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        //options to add
        var razorPayOptions = {
            amount: 2500,
            currency: "INR",
        };
        //the detail you want to show to create order 
        payrazor.orders.create(razorPayOptions, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            //create a order
            Order.create({ orderid: order.id, status: "PENDING" }).then(() => {
                //these value are used to intialise razorpay model
                return res.status(201).json({
                    message: "ordered",
                    data: {
                        order, key_id: payrazor.key_id
                    }
                })
            }).catch(err => {
                throw new Error(err);
            })
        })
    }
    catch (err) {
        console.log(`${err} in buyPremium`)
        return res.status(500).json({
            message: "ordered failed",
        })
    }
}

exports.updateTransactionStatus = (req, res, next) => {
    const { payment_id, order_id } = req.body;
    const userId = req.userId;

    Order.findOne({
        where: {
            orderid: order_id
        }
    }).then(order => {
        //do it together
        Promise.all([
            order.update({ paymentid: payment_id, status: "SUCCESSFULL", userId }),
            User.update({ ispremiumuser: true }, { where: { id: userId } })
        ]).then(() => {
            return res.status(202).json({
                message: "Transaction Successfull"
            });
        }).catch((err) => {
            throw new Error(err);
        });

    }).catch((err) => {
        console.log(`${err} in updateTransactionStatus`)
        //forbiden
        res.status(403).json({ message: 'Sometghing went wrong' })
    })
}

exports.transactionFailed = (req, res, next) => {
    const { payment_id, order_id } = req.body;
    const userId = req.userId;

    Order.findOne({
        where: {
            orderid: order_id
        }
    }).then(order => {
        order.update({ paymentid: payment_id, status: "FAILED", userId })
            .then(() => {
                return res.status(400).json({
                    message: "Transaction failed"
                });
            })
            .catch((err) => {
                throw new Error(err);
            });
    }).catch(err => {
        console.log(`${err} in transactionFailed`)
        res.status(403).json({ message: 'Sometghing went wrong' })
    });
}