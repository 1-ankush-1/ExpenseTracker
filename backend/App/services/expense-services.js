const { Expense } = require("../model");

exports.getAllExpenses = async (userId) => {
    return Expense.findAll({
        where: { userId }
    })
}

exports.addExpense = async () => {

}


