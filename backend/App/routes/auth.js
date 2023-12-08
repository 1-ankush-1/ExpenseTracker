const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.js");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.post("/password/forgotpassword", authController.forgotPassword);
// router.get("/password/resetpassword/:forgotid", authController.resetPassword);
// router.put("/password/updatepassword/:resetid", authController.updatePassword);

module.exports = router;