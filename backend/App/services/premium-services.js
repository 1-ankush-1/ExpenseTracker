const { default: mongoose } = require("mongoose");
const Expense = require("../models/expense");
const Income = require("../models/income");
const XLSX = require('xlsx');
const Excel = require('exceljs');

//format specify combine by month or date
exports.timelyReport = async (userId, start, end, format) => {

    const [expenses, incomes] = await Promise.all([Expense.aggregate([
        {
            $match: {
                userId: userId,
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: format, date: '$createdAt' } },
                totalExpense: { $sum: '$amt' }
            }
        }, {
            $sort: {
                _id: 1
            }
        }
    ]),
    Income.aggregate([                                                              //get income btw and group it by date and sum the income
        {
            $match: {
                userId: userId,
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: format, date: '$createdAt' } },
                totalIncome: { $sum: '$amt' }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
    ])


    const mergedResults = [];

    // Create a Set of all unique dates from both
    const allDatesSet = new Set([...expenses.map(item => item._id), ...incomes.map(item => item._id)]);

    //iterate on set and merge by date
    allDatesSet.forEach(date => {
        const expenseItem = expenses.find(item => item._id === date) || { _id: date, totalExpense: 0 };
        const incomeItem = incomes.find(item => item._id === date) || { _id: date, totalIncome: 0 };

        mergedResults.push({
            date: date,
            totalExpense: expenseItem.totalExpense,
            totalIncome: incomeItem.totalIncome,
        });
    });

    return mergedResults
}

exports.convertToExcel = async (data) => {

    // // Convert data to 2D array
    // let data_2D = data.map(obj => Object.values(obj).map(value => (value instanceof mongoose.Types.Decimal128 ? value.toString() : value)));

    // // Add the headers to the start of the 2D array
    // data_2D.unshift(Object.keys(data[0]));

    // // Create a new workbook and add the data to a worksheet
    // let wb = XLSX.utils.book_new();
    // let ws = XLSX.utils.aoa_to_sheet(data_2D);
    // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // // Convert the workbook to binary format
    // const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    // return excelBuffer;

    const data_2D = data.map(obj => Object.values(obj).map(value => (value instanceof mongoose.Types.Decimal128 ? value.toString() : value)));

    if (data_2D.length === 0) {
        throw new Error('Data array is empty.');
    }

    data_2D.unshift(Object.keys(data[0]));

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    // Add data to the worksheet
    worksheet.addRows(data_2D);

    // Add header styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    const excelBuffer = await workbook.xlsx.writeBuffer();
    return excelBuffer;
}