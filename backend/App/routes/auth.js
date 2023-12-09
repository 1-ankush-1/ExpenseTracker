const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.js");
const forgetRoutes = require("./forget.js");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.use("/password", forgetRoutes);

module.exports = router;