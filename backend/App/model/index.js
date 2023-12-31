const User = require('./user.js');
const Expense = require('./expense.js');
const Order = require('./order.js');
const ForgotPasswordRequest = require("./forgot-password.js");
const Income = require("./income.js");
const DownloadedFile = require('./downloaded-files.js');

//Association One to Many 
User.hasMany(Expense);
Expense.belongsTo(User);

//Association One to Many 
User.hasMany(Income);
Income.belongsTo(User);

//Association One to Many
User.hasMany(Order);
Order.belongsTo(User);

//Association One to Many
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

//As
User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

module.exports = { User, Expense, Order, ForgotPasswordRequest, Income, DownloadedFile };