const express = require("express");
const router = express.Router();
const authController = require("../controller/auth-controller.js");

router.post("/signup", authController.signup);

module.exports = router;