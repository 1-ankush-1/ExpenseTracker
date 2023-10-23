const jwt = require("jsonwebtoken");

exports.generateToken = (id, name) => {
    return jwt.sign({ id, name }, process.env.SECRET);
}