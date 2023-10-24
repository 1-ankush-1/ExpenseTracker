const { Sequelize } = require("sequelize");
const { User, Expense } = require("../model");

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
        order: [['totalexpense', 'DESC']]
    }).then(result => {
        res.status(200).json({
            message: "successfully fetched",
            data: result
        })

    }).catch(err => {
        console.log(`${err} in allLeaderBoardData`);
        res.status(500).json({
            message: "failed to fetch leaderboard data",
        })
    })
}