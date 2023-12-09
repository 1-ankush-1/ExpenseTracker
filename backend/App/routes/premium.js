const express = require("express");
const router = express.Router();
const premiumController = require("../controllers/premium.js");

router.get("/leaderboard", premiumController.allLeaderBoardData);
// router.get("/report/day/:date", premiumController.monthlyReport)
router.get("/report/month/:month", premiumController.monthlyReport);
router.get("/report/year/:year", premiumController.yearlyReport);
router.get("/report/download", premiumController.downloadReport);

module.exports = router;