const jwt = require("jsonwebtoken");
const { User } = require("../model/index.js");

const Authentication = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        // console.log(token);
        const tokendetails = jwt.verify(token, process.env.SECRET);
        // console.log(tokendetails)
        User.findByPk(
            tokendetails.id
        ).then(user => {
            if (!user) {
                return res.status(404).json({ message: "no user found" })
            }
            // console.log(user)
            req.userId = user.id;
            next();
        }).catch(err => { throw new Error(err) });
    } catch (err) {
        console.log(`${err} in Authentication`);
        return res.status(401).json({ message: "authatication fail" })
    }
}

module.exports = Authentication;