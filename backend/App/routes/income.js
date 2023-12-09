const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/income.js");

router.get("/", incomeController.getAllIncome);
router.post("/add", incomeController.addIncome);
router.delete("/delete/:id", incomeController.deleteIncome);

module.exports = router;