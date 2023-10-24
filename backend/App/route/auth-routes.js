const express = require("express");
const router = express.Router();
const authController = require("../controller/auth-controller.js");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/password/forgotpassword", authController.forgotPassword);

module.exports = router;