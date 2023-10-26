const sequelize = require("../config/connect.js");
const { Income, User } = require("../model/index.js");

exports.getAllIncome = (req, res, next) => {
    //cred
    const userId = req.userId;

    //check for empty
    if (!userId) {
        res.status(404).json({
            message: "missing user id"
        });
    }

    Income.findAll({
        where: {
            userId: userId
        }
    }).then(incomes => {
        res.status(200).json({
            message: "Successfully fetched incomes",
            data: incomes
        });
    }).catch(err => {
        console.log(`${err} in getAllincome`);
        res.status(500).json({
            message: "An error occurred while fetching incomes"
        });
    });
}

exports.addIncome = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { amt, desc } = req.body;
        const userId = req.userId;
        //check for empty
        if (!amt || !desc || !userId) {
            return res.status(404).json({
                message: "some field are empty",
            })
        }
        //create a object
        const income = { amt, desc, userId }

        //added transaction for atomicity
        const userResult = await User.findByPk(userId, { transaction: t });
        const incomeResult = await Income.create(income, { transaction: t });
        userResult.totalincome += parseFloat(amt);
        //update user totalIncome
        await userResult.save({ transaction: t });
        await t.commit();
        res.status(200).json({ message: "Income added successfully", data: incomeResult });
    } catch (err) {
        await t.rollback();
        console.log(`${err} in addIncome`)
        res.status(500).json({
            message: "not able to add Income try again"
        })
    }
}

exports.deleteIncome = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userId = req.userId;

        //check for empty
        if (!id) {
            res.status(404).json({
                message: "missing Income id"
            });
        }

        //find Income to get amt remove the amt from total income
        const income = await Income.findOne({
            where: {
                id: id,
                userId: userId
            }
        }, { transaction: t });

        //find  user and delete the Income
        const [user,] = await Promise.all([
            User.findByPk(userId, { transaction: t }),
            Income.destroy({
                where: {
                    id: id,
                    userId: userId
                },
            }, { transaction: t })
        ]);

        user.totalincome -= parseFloat(income.amt);
        //update user totalincomes
        await user.save({ transaction: t });
        await t.commit();
        res.status(200).json("Income get deleted successfully");
    }
    catch (err) {
        await t.rollback();
        console.log(`${err} in deleteincome`)
        res.status(500).json({
            message: "not able to delete income"
        });
    };
}

