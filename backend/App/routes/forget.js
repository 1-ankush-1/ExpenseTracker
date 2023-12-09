const express = require("express");
const router = express.Router();
const ForgetController = require("../controllers/forget.js");

router.post("/forgetpassword", ForgetController.forgetPassword);
router.get("/resetpassword/:forgotid", ForgetController.resetPassword);
router.put("/updatepassword/:resetid", ForgetController.updatePassword);

module.exports = router;