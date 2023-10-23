const Razorpay = require("razorpay");
const { Order, User } = require("../model/index.js");

exports.buyPremium = (req, res, next) => {

    try {
        //new object of razorpay
        let payrazor = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        //your amount 
        const amount = 1;
        //the detail you want to show to create order 
        payrazor.orders.create({ amount, currency: "INR" }, (err, order) => {
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
    const { payment_id, order_id } = res.body;

    Order.findOne({
        where: {
            orderid: order_id
        }
    }).then(order => {
        //do it together
        Promise.all([
            order.update({ payment_id: payment_id, status: "SUCCESSFULL" }),
            User.update({ ispremiumuser: true })
        ]).then(() => {
            return res.status(202).json({
                message: "Transaction Successfull"
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }).catch((err) => {
        throw new Error(err);
    })
}