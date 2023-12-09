const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const Authentication = (req, res, next) => {
    try {
        let token = req.header("Authorization")
        // token = token.split(' ')[1]

        // console.log(token);
        const tokendetails = jwt.verify(token, process.env.SECRET);
        // console.log(tokendetails)
        User.findById(tokendetails.id).then(user => {
            if (!user) {
                return res.status(404).json({ message: "no user found" })
            }
            req.userId = user._id;
            next();
        }).catch(err => { throw new Error(err) });
    } catch (err) {
        console.log(`${err} in Authentication`);
        return res.status(401).json({ message: "authatication fail" })
    }
}

module.exports = Authentication;