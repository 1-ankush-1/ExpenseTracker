const User = require("../models/user.js")
const File = require("../models/files.js")
const premiumService = require("../services/premium.js");
const { uploadToS3 } = require("../services/s3.js");

exports.allLeaderBoardData = async (req, res, next) => {
    try {
        //select field . in sort -1 repesent desc
        const result = await User.find().select("id name totalexpenses").sort({ totalexpenses: -1 }).lean();
        res.status(200).json({
            message: "successfully fetched",
            data: result
        })
    } catch (err) {
        console.log(`${err} in allLeaderBoardData`);
        res.status(500).json({
            message: "failed to fetch leaderboard data",
        })
    }
}

exports.monthlyReport = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { month } = req.params;
        const start = new Date(new Date().getFullYear(), month - 1, 1);
        const end = new Date(new Date().getFullYear(), month, 0);

        const report = await premiumService.timelyReport(userId, start, end, '%Y-%m-%d')

        let totalIncome = 0;
        let totalExpense = 0;
        let totalSaving = 0;

        //report and total
        const summaries = report.map(result => {
            totalIncome += parseFloat(result.totalIncome);
            totalExpense += parseFloat(result.totalExpense);

            return {
                date: result.date,
                income: result.totalIncome,
                expense: result.totalExpense,
                savings: (totalIncome - totalExpense)
            };
        });

        //create total saving
        totalSaving = totalIncome - totalExpense;

        res.status(200).json({
            data: { user: summaries, totalIncome, totalExpense, totalSaving },
            message: "report fetched successfully"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "failed to fetch report "
        })
    }
}

exports.yearlyReport = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { year } = req.params;
        const start = new Date(parseInt(year), 0, 1); // start of year send
        const end = new Date(parseInt(year) + 1, 0, 1); // start of the next year

        //create report
        const report = await premiumService.timelyReport(userId, start, end, '%Y-%m');

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        //get savings 
        const summaries = report.map(result => ({
            date: monthNames[result.date.split("-")[1] - 1],
            income: result.totalIncome,
            expense: result.totalExpense,
            savings: result.totalIncome - result.totalExpense
        }));

        res.status(200).json({
            data: summaries,
            message: "report fetched successfully"
        })
    } catch (err) {
        console.log(`${err} in yearlyReport`);
        res.status(500).json({
            message: "failed to fetch report "
        })
    }
}


exports.downloadReport = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { filetype, timeslot } = req.query;
        let report = ""
        if (filetype === 'year') {
            const start = new Date(parseInt(timeslot), 0, 1);
            const end = new Date(parseInt(timeslot) + 1, 0, 1);
            report = await premiumService.timelyReport(userId, start, end, '%Y-%m');

        } else if (filetype === 'month') {
            const start = new Date(new Date().getFullYear(), timeslot - 1, 1);
            const end = new Date(new Date().getFullYear(), timeslot, 0);
            report = await premiumService.timelyReport(userId, start, end, '%Y-%m-%d');
        }

        const foldername = `report/${filetype}/`
        const filename = "reportFile";
        const expenseExcelFile = await premiumService.convertToExcel(report);
        const date = new Date();
        const path = `${foldername}${userId}/${filename}-${date}.xlsx`

        const fileURL = await uploadToS3(expenseExcelFile, path);

        const file = {
            userId, fileurl: fileURL
        }
        await File.create(file);
        return res.status(200).json({ data: fileURL, Message: "successfully added to s3" });
    } catch (err) {
        console.log(`${err} in downloadReport`);
        res.status(500).json({
            message: "failed to download report "
        })
    }
}