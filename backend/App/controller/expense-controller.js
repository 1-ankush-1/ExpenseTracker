const { Expense } = require("../model/index.js");

exports.getAllExpense = (req, res, next) => {
    const userId = req.userId;
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

    if (!amt || !desc || !catogary || !userId) {
        return res.status(404).json({
            message: "some field are empty",
        })
    }

    const expense = { amt, desc, catogary, userId }

    Expense.create(expense).then((data) => {
        return res.status(200).json({ message: "Expense added successfully", data: data });
    }).catch(err => {
        console.log(`${err} in addExpense`)
        res.status(500).json({
            message: "not able to add expense try again"
        });
    })
}

exports.deleteExpense = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({
            message: "missing expense id"
        });
    }

    Expense.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json("Expense get deleted successfully");
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