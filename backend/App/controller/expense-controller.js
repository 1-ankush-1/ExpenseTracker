const { Expense, User } = require("../model/index.js");

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

exports.addExpense = (req, res, next) => {
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

    Promise.all([
        User.findByPk(userId),
        Expense.create(expense)
    ]).then(([user, expense]) => {
        user.totalexpenses += parseFloat(amt);
        user.save();
        return res.status(200).json({ message: "Expense added successfully", data: expense });
    }).catch(err => {
        console.log(`${err} in addExpense`)
        res.status(500).json({
            message: "not able to add expense try again"
        });
    })
}

exports.deleteExpense = (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;

    //check for empty
    if (!id) {
        res.status(404).json({
            message: "missing expense id"
        });
    }
    
    //find expense to get amt remove the amt from total expense
    Expense.findOne({
        where: {
            id: id,
            userId: userId
        }
    }).then((expense) => {
        Promise.all([
            User.findByPk(userId),
            Expense.destroy({
                where: {
                    id: id,
                    userId: userId
                }
            })
        ]).then(([user,]) => {
            user.totalexpenses -= parseFloat(expense.amt);
            user.save();
            return res.status(200).json("Expense get deleted successfully");
        }).catch(err => { throw new Error(err); })
    }).catch(err => {
        console.log(`${err} in deleteExpense`)
        res.status(500).json({
            message: "not able to delete expense"
        });
    });

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