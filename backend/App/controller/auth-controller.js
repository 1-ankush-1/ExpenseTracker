const User = require("../model/user.js")

exports.signup = (req, res, next) => {
    const { name, email, phone, password } = req.body;
    const user = { name, email, phone, password }

    User.findOne({
        where: {
            email: email
        }
    }).then((result) => {
        if (!result) {
            User.create(user).then(result => {
                res.status(200).json({
                    message: "registered successfully",
                    data: result
                })
            }).catch(err => {
                console.log(`${err} in signup`);
                res.status(500).json({
                    message: "failed to register user",
                })
            })
        } else {
            res.status(404).json({
                message: "user already exist",
            })
        }
    }).catch(err => {
        console.log(`${err} in signup`);
        res.status(500).json({
            message: "failed to register user",
        })
    })
}