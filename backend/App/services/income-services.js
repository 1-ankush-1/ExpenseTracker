const Income = require("../models/income.js");

exports.getAllIncomes = async (userId) => {
    return Income.find({
        userId
    })
}
