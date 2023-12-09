const User = require("../models/user.js")
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/generate-token.js");

exports.signup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(404).json({
                message: "some field are empty",
            })
        }
        const user = { name, email, phone, password }

        const userExist = await User.findOne({
            email: email
        })

        if (!userExist) {
            //hash the password(salt - randomness)
            bcrypt.hash(user.password, parseInt(process.env.SALT), async (err, hash) => {
                if (err) {
                    console.log(`${err} in signup`)
                    return res.status(500).json({
                        message: "failed to register user",
                    })
                }
                user.password = hash;
                const result = new User(user);
                // console.log(result);
                await result.save();
                return res.status(200).json({
                    message: "registered successfully",
                    data: result
                })
            })
        } else {
            res.status(404).json({
                message: "user already exist",
            })
        }
    }
    catch (err) {
        console.log(`${err} in signup`);
        res.status(500).json({
            message: "failed to register user",
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                message: "some field is empty",
            })
        }


        //check if user exist
        const user = await User.findOne({
            email: email,
        })

        //not exist
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        //compare incoming password with saved hash
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(`${err} in login `)
                res.status(500).json({
                    message: "failed to login"
                })
            }
            if (result) {
                //except password send everything
                let { password, ...userDataToSend } = user._doc;
                let token = generateToken(userDataToSend._id, userDataToSend.name);
                return res.status(200).json({
                    message: "User login sucessful", token: token, data: userDataToSend
                })
            } else {
                return res.status(401).json({
                    message: "incorrect password"
                })
            }
        });

    } catch (err) {
        console.log(`${err} in login `)
        res.status(500).json({ message: "failed to login" })
    }
}

