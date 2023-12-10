const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const cors = require("cors");
const Router = require("./App/routes/index.js")
// const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const dbConnect = require("./App/config/connect.js")

const app = express();
app.use(express.static('public'));
const accessLogStream = fs.WriteStream(path.join(__dirname, 'access.log'), {
    flag: 'a'
});
/**
 * Middleware
 */
// app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(bodyparser.json({ extended: false }));

/**
 * Routes
 */
app.use(Router);

/**
 * connect To DB and start server
 */
dbConnect((result) => {
    app.listen(process.env.port || 3000, () => {
        console.log(`server is running on http://localhost:${process.env.port || 3000}/`)
    })
});