const express = require("express");
const router = express.Router();
const Authentication = require("../middleware/authenticate-user.js")
const authRoutes = require("./auth-routes.js");
const expenseRoutes = require("./expense-routes.js");
const purchaseRoutes = require("./purchase-routes.js");
const premiumRoutes = require("./premium-routes.js");
const incomeRoutes = require("./income-route.js");
const path = require("path");
const fs = require("fs")

router.use("/auth", authRoutes);
router.use("/expense", Authentication, expenseRoutes);
router.use("/income", Authentication, incomeRoutes);
router.use("/purchase", Authentication, purchaseRoutes);
router.use("/premium", Authentication, premiumRoutes);

//if no route found
router.use('/', (req, res, next) => {
    //get file path
    let filePath = path.join(__dirname, `../../public/components/${req.url}`);

    //check if the path exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        //if not or path is root, redirect to login page
        if (err || req.url === "/") {
            //adding absolute path so it doesnt add relative path in other request
            res.redirect(`${process.env.DOMAIN}/login/html/login.html`);
        } else {
            res.sendFile(filePath);
        }
    });
});


module.exports = router;