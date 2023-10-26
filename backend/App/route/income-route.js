const express = require("express");
const router = express.Router();
const incomeController = require("../controller/income-controller.js");

router.get("/", incomeController.getAllIncome);
router.post("/add", incomeController.addIncome);
router.delete("/delete/:id", incomeController.deleteIncome);

module.exports = router;