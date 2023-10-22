const { User, Expense } = require("../model/index.js");

exports.getAllExpense = (req, res, next) => {
    const { userid } = req.params;
    Expense.findAll({
        where: {
            UserId: userid
        }
    }).then(expenses => {
        res.status(200).send({
            message: "Successfully fetched expenses",
            data: expenses
        });
    }).catch(err => {
        console.log(`${err} in getAllExpense`);
        res.status(500).send({
            message: "An error occurred while fetching expenses"
        });
    });
}

exports.addExpense = (req, res, next) => {
    const { amt, desc, catogary, userId } = req.body;

    const expense = { amt, desc, catogary, userId }

    Expense.create(expense).then((data) => {
        return res.status(200).send({ message: "Expense added successfully", data: data });
    }).catch(err => {
        console.log(`${err} in addExpense`)
    })

}
exports.deleteExpense = (req, res, next) => {
    const { id } = req.params;

    Expense.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).send("Expense get deleted successfully");
    }).catch(err => {
        console.log(`${err} in deleteExpense`)
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
            res.status(200).send("Expense get updated successfully");
        }).catch(err => {
            console.log(`${err} in editExpense`)
        });
}