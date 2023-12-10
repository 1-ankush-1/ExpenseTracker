const expenseService = require("../services/expense.js")
const Expense = require("../models/expense.js");
const User = require("../models/user.js");
const { uploadToS3 } = require("../services/s3.js");
const mongoose = require("mongoose");

exports.downloadFile = async (req, res, next) => {
    try {
        const expenses = await Expense.find();
        const stringifyExpense = JSON.stringify(expenses);
        const foldername = "expenses/"
        const filename = "Expense";
        const date = new Date();
        const userId = req.userId;
        const path = `${foldername}${userId}/${filename}-${date}.txt`

        const fileURL = await uploadToS3(stringifyExpense, path);
        // console.log(fileURL);
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
    const session = await mongoose.startSession();

    try {
        const result = await session.withTransaction(async () => {
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
            const userResult = await User.findById(userId).session(session);
            const expenseResult = await Expense.create([expense], { session });
            userResult.totalexpenses = parseFloat(userResult.totalexpenses) + parseFloat(amt);
            // console.log(userResult, expenseResult);

            //update user totalexpenses
            await userResult.save({ session });
            return expenseResult[0];
        })
        res.status(200).json({ message: "Expense added successfully", data: result });
    } catch (err) {
        console.log(`${err} in addExpense`)
        res.status(500).json({
            message: "not able to add expense try again"
        })
    } finally {
        session.endSession();
    }
}

exports.deleteExpense = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
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
                _id: id,
                userId: userId
            }).session(session).lean();

            //find  user and delete the expense
            const [user,] = await Promise.all([
                User.findById(userId).session(session),
                Expense.findOneAndDelete({
                    _id: id,
                    userId: userId
                }, { session }).lean()
            ]);

            user.totalexpenses -= parseFloat(expense.amt);
            //update user totalexpenses
            await user.save({ session });
        })
        res.status(200).json("Expense get deleted successfully");
    }
    catch (err) {
        console.log(`${err} in deleteExpense`)
        res.status(500).json({
            message: "not able to delete expense"
        });
    } finally {
        session.endSession();
    }
}

exports.editExpense = async (req, res, next) => {
    try {
        const { amt, desc, catogary } = req.body;
        const { id } = req.params;
        await Expense.findByIdAndUpdate(id, { $set: { amt, desc, catogary } })
        res.status(200).json("Expense get updated successfully");
    } catch (err) {
        console.log(`${err} in deleteExpense`)
        res.status(500).json({
            message: "not able to update expense"
        });
    }
}

exports.getExpenseRange = async (req, res, next) => {
    try {
        const userId = req.userId;
        let { page, rowperpage } = req.query;
        let pageLimits = parseInt(rowperpage) || 5;
        page = parseInt(page) || 1;       //if page is undefined assign 1

        //check for empty
        if (!userId) {
            res.status(404).json({
                message: "missing user id"
            });
        }

        const [totalExpenses, expenses] = await Promise.all([
            Expense.countDocuments({ userId }),         //get no of expense
            Expense.find({ userId }).limit(pageLimits).skip((page - 1) * pageLimits).lean()
        ])
        // console.log(pageLimits, " --->", (page - 1) * pageLimits)
        // console.log(totalExpenses, expenses);

        // console.log(expenses)
        res.status(200).json({
            expenses,
            currrentPage: page,
            hasNextPage: pageLimits * page < totalExpenses,
            nextPage: parseInt(page) + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses / pageLimits)
        })
    } catch (err) {
        console.log(`${err} in getExpenseRange`);
        res.status(500).json("failed to fetch expense");
    }
}
