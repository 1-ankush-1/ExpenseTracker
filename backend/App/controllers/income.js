const mongoose = require("mongoose");
const sequelize = require("../config/connect.js");
const User = require("../models/user.js")
const Income = require("../models/income.js")
const incomeService = require("../services/income-services.js")

exports.getAllIncome = async (req, res, next) => {
    try {
        //cred
        const userId = req.userId;

        //check for empty
        if (!userId) {
            res.status(404).json({
                message: "missing user id"
            });
        }
        const allincomes = await incomeService.getAllIncomes(userId);
        res.status(200).json({
            message: "Successfully fetched incomes",
            data: allincomes
        });

    } catch (err) {
        console.log(`${err} in getAllincome`);
        res.status(500).json({
            message: "An error occurred while fetching incomes"
        });
    }
}

//here working
exports.addIncome = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        // Used withTransaction to manage the session - inside code will execute in single session
        const result = await session.withTransaction(async () => {
            const { amt, desc } = req.body;
            const userId = req.userId;

            const userResult = await User.findById(userId).session(session);        //check if user exist
            if (!userResult) {
                throw new Error("User not found");
            }

            const income = new Income({ amt, desc, userId });
            const incomeResult = await income.save({ session });

            userResult.totalincome = parseFloat(userResult.totalincome) + parseFloat(amt);
            await userResult.save({ session });

            // Return the desired data
            return { user: userResult, income: incomeResult };
        });

        res.status(200).json({ message: "Income added successfully", data: result.income });
    } catch (err) {
        console.error(`${err} in addIncome`);
        res.status(500).json({
            message: "Not able to add Income. Please try again.",
        });
    } finally {
        session.endSession();
    }
}

exports.deleteIncome = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
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
                _id: id,
                userId: userId
            }).session(session).lean();


            //find  user and delete the Income - using promise because no save or create is used
            const [user,] = await Promise.all([
                User.findById(userId).session(session),
                Income.findOneAndDelete({
                    _id: id,
                    userId: userId
                }, { session }).lean()
            ]);
            user.totalincome -= parseFloat(income.amt);

            //update user totalincomes
            await user.save({ session });
        })
        res.status(200).json("Income get deleted successfully");
    }
    catch (err) {
        console.log(`${err} in deleteincome`)
        res.status(500).json({
            message: "not able to delete income"
        });
    } finally {
        session.endSession();
    }
}


//imp - do not use save or create with promise in transaction becuase it create seprate session (Note - transaction happen in single session)which lead to transaction error
// instead prefer to use withTransaction(code inside it will execute in single session . it handel start abort commit all operation automatically)
