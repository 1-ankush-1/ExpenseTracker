const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.js");

router.get("/", expenseController.getAllExpense);
router.get("/get", expenseController.getExpenseRange);
router.post("/add", expenseController.addExpense);
router.delete("/delete/:id", expenseController.deleteExpense);
router.put("/edit/:id", expenseController.editExpense);
router.get("/file/download", expenseController.downloadFile);

module.exports = router;