const sequelize = require("../config/connect.js");
const { Expense, User } = require("../model/index.js");
const AWS = require("aws-sdk");

function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    s3bucket.createBucket(() => {
        let params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data
        }
        s3bucket.upload(params, (err, result) => {
            if (err) {
                console.log(`${err} in s3`);
            } else {
                console.log("success", result);
            }
        });
    })

}

exports.downloadFile = async (req, res, next) => {
    const expenses = await Expense.findAll();
    res.send(expenses);
    const stringifyExpense = JSON.stringify(expenses);
    const filename = "Expense.txt";

    const fileURL = uploadToS3(stringifyExpense, filename);
    // res.status(200).json({ fileURL, Message: "successfully added to s3" });
}

exports.getAllExpense = (req, res, next) => {
    //cred
    const userId = req.userId;

    //check for empty
    if (!userId) {
        res.status(404).json({
            message: "missing user id"
        });
    }

    Expense.findAll({
        where: {
            userId: userId
        }
    }).then(expenses => {
        res.status(200).json({
            message: "Successfully fetched expenses",
            data: expenses
        });
    }).catch(err => {
        console.log(`${err} in getAllExpense`);
        res.status(500).json({
            message: "An error occurred while fetching expenses"
        });
    });
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

