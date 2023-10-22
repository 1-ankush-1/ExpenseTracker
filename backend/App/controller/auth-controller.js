const User = require("../model/user.js")

exports.signup = (req, res, next) => {
    const { name, email, phone, password } = req.body;
    const user = { name, email, phone, password }

    User.findOne({
        where: {
            email: email
        }
    }).then((result) => {
        //no user create one
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

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    //check if user exist
    User.findOne({
        where: {
            email: email,
        }
    }).then(user => {
        //not exist
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        //check password
        if (user.password === password) {
            res.status(200).json({
                message: "User login sucessful", permission: true
            })
        } else {
            res.status(401).json({
                message: "incorrect password"
            })
        }
    }).catch(err => {
        console.log(`${err} in login `)
        res.status(500).json({
            message: "something went wrong"
        })
    })
}