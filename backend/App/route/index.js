const express = require("express");
const router = express.Router();
const Authentication = require("../middleware/authenticate-user.js")
const authRoutes = require("./auth-routes.js");
const expenseRoutes = require("./expense-routes.js");
const purchaseRoutes = require("./purchase-routes.js");
const premiumRoutes = require("./premium-routes.js");
const incomeRoutes = require("./income-route.js");

router.use("/auth", authRoutes);
router.use("/expense", Authentication, expenseRoutes);
router.use("/income", Authentication, incomeRoutes);
router.use("/purchase", Authentication, purchaseRoutes);
router.use("/premium", Authentication, premiumRoutes);

//if no route found
router.use((req, res, next) => {
    res.status(404).send("no routes found");
})

module.exports = router;