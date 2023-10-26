const sequelize = require("../config/connect.js");
const expenseService = require("../services/expense-services.js")
const { Expense, User } = require("../model/index.js");
const { uploadToS3 } = require("../services/s3-services.js");

exports.downloadFile = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        const stringifyExpense = JSON.stringify(expenses);
        const foldername = "expenses/"
        const filename = "Expense";
        const date = new Date();
        const userId = req.userId;
        const path = `${foldername}${userId}/${filename}-${date}.txt`

        const fileURL = await uploadToS3(stringifyExpense, path);
        console.log(fileURL);
        return res.status(200).json({ data: fileURL, Message: "successfully added to s3" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ Message: "failed to upload" });
    }
}

exports.getAllExpense = async (req, res, next) => {
    try {
        //cred
        const userId = req.userId;

        //check for empty
        if (!userId) {
            res.status(404).json({
                message: "missing user id"
            });
        }

        const allExpenses = await expenseService.getAllExpenses(userId);
        res.status(200).json({
            message: "Successfully fetched expenses",
            data: allExpenses
        });

    } catch (err) {
        console.log(`${err} in getAllExpense`);
        res.status(500).json({
            message: "An error occurred while fetching expenses"
        });
    }
}

exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { amt, desc, catogary } = req.body;
        const userId = req.userId;
        //check for empty
        if (!amt || !desc || !catogary || !userId) {
            return res.status(404).json({
                message: "some field are empty",
            })
        }
        //create a object
        const expense = { amt, desc, catogary, userId }

        //added transaction for atomicity
        const userResult = await User.findByPk(userId, { transaction: t });
        const expenseResult = await Expense.create(expense, { transaction: t });
        userResult.totalexpenses += parseFloat(amt);
        //update user totalexpenses
        await userResult.save({ transaction: t });
        await t.commit();
        res.status(200).json({ message: "Expense added successfully", data: expenseResult });
    } catch (err) {
        await t.rollback();
        console.log(`${err} in addExpense`)
        res.status(500).json({
            message: "not able to add expense try again"
        })
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userId = req.userId;

        //check for empty
        if (!id) {
            res.status(404).json({
                message: "missing expense id"
            });
        }

        //find expense to get amt remove the amt from total expense
        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: userId
            }
        }, { transaction: t });

        //find  user and delete the expense
        const [user,] = await Promise.all([
            User.findByPk(userId, { transaction: t }),
            Expense.destroy({
                where: {
                    id: id,
                    userId: userId
                },
            }, { transaction: t })
        ]);

        user.totalexpenses -= parseFloat(expense.amt);
        //update user totalexpenses
        await user.save({ transaction: t });
        await t.commit();
        res.status(200).json("Expense get deleted successfully");
    }
    catch (err) {
        await t.rollback();
        console.log(`${err} in deleteExpense`)
        res.status(500).json({
            message: "not able to delete expense"
        });
    };
}

exports.editExpense = (req, res, next) => {
    const { amt, desc, catogary } = req.body;
    const { id } = req.params;

    Expense.update({ amt, desc, catogary },
        {
            where: {
                id: id
            }
        }).then(() => {
            res.status(200).json("Expense get updated successfully");
        }).catch(err => {
            console.log(`${err} in editExpense`)
            res.status(500).json({
                message: "not able to edit expense"
            });
        });
}

