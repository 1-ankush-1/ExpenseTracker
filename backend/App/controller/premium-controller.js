const { Sequelize } = require("sequelize");
const { User, Expense } = require("../model/index.js")

exports.allLeaderBoardData = (req, res, next) => {

    User.findAll({
        attributes: [
            "id",
            "name",
            [Sequelize.fn('SUM', Sequelize.col('expenses.amt')), 'totalexpense']
        ],
        include: [{
            model: Expense,
            attributes: []
        }],
        group: ['User.id'],
        order: [[Sequelize.literal('totalexpense'), 'DESC']]
    }).then(result => {
        console.log(result)
    }).catch(err => {
        console.log(err);
    })
}