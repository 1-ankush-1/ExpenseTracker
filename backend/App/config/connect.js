const mongoose = require("mongoose");

function dbConnect(callback) {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.fmv1vqf.mongodb.net/`).then(result => {
        callback();
    }).catch(err => console.log(`${err} in database connection`))
}

module.exports = dbConnect;

