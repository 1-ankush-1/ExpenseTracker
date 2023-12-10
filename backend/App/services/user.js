const { Expense } = require("../model");

exports.getExpenses = (req, where) => {
    const userId = req.userId
    return Expense.findAll({
        where: userId
    })
}



