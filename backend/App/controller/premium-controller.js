const { User } = require("../model");

exports.allLeaderBoardData = (req, res, next) => {

    User.findAll({
        attributes: [
            "id",
            "name",
            "totalexpenses"
        ],
        order: [['totalexpenses', 'DESC']]
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