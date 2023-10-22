const express = require("express");
const router = express.Router();
const authRoutes = require("./auth-routes.js");
const expenseRoutes = require("./expense-routes.js");

router.use("/auth", authRoutes);
router.use("/expense", expenseRoutes);

//if no route found
router.use((req, res, next) => {
    res.status(404).send("no routes found");
})

module.exports = router;