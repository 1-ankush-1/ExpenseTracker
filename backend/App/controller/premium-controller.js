const { Sequelize } = require("sequelize");
const sequalize = require("../config/connect.js")

exports.allLeaderBoardData = (req, res, next) => {

    sequalize.query(`
        SELECT user.id, user.name, 
            SUM(expenses.amt) AS totalexpense 
            FROM users AS user 
            LEFT OUTER JOIN expenses  
            ON user.id = expenses.userId
            GROUP BY user.id 
            ORDER BY totalexpense DESC`, {
        type: Sequelize.QueryTypes.SELECT
    }).then(result => {
        res.status(200).json({
            message: "successfully fetched",
            data: result
        })
        console.log(result)
    }).catch(err => {
        console.log(`${err} in allLeaderBoardData`);
        res.status(500).json({
            message: "failed to fetch leaderboard data",
        })
    })
}