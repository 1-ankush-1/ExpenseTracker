const sequelize = require("../config/connect");

exports.timelyReport = (userId, start, end, date) => {
    console.log(date)
    return sequelize.query(`
    SELECT 
        ${date}(createdAt) as period, 
        SUM(case when type = 'income' then amt else 0 end) as totalIncome,
        SUM(case when type = 'expense' then amt else 0 end) as totalExpense
    FROM 
        (
            SELECT 'income' as type, amt, createdAt FROM incomes WHERE userId = :userId AND createdAt BETWEEN :start AND :end
            UNION ALL
            SELECT 'expense' as type, amt, createdAt FROM expenses WHERE userId = :userId AND createdAt BETWEEN :start AND :end
        ) AS Transactions
    GROUP BY 
     period
`, {
        replacements: { userId: userId, start: start, end: end },
        type: sequelize.QueryTypes.SELECT
    });
}