const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expense-controller.js");

router.get("/", expenseController.getAllExpense);
router.post("/add", expenseController.addExpense);
router.delete("/delete/:id", expenseController.deleteExpense);
router.put("/edit/:id", expenseController.editExpense);

module.exports = router;