const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const Router = require("./App/route/index.js")
const sequelize = require("./App/config/connect.js");

const app = express();

/**
 * Middleware
 */
app.use(cors());
app.use(bodyparser.json({ extended: false }));

/**
 * Routes
 */
app.use(Router);

/**
 * sync with database
 */
sequelize.sync().then(() => {
}).catch(err => {
    console.log(`${err} occured whne syncing with sequalize`)
});

/**
 * start server
*/
app.listen(process.env.port || 3000, () => {
    console.log(`server is running on http://localhost:${process.env.port || 3000}/`)
})