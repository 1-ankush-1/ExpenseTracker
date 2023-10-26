const { Income } = require("../model");

exports.getAllIncomes = async (userId) => {
    return Income.findAll({
        where: { userId }
    })
}
