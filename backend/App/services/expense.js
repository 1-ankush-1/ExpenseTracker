const { Expense } = require("../models");

exports.getAllExpenses = async (userId) => {
    return Expense.find(
        { userId }
    ).lean();
}

exports.addExpense = async () => {

}


