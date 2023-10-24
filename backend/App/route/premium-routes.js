const express = require("express");
const router = express.Router();
const premiumController = require("../controller/premium-controller.js");

router.get("/leaderboard", premiumController.allLeaderBoardData);

module.exports = router;