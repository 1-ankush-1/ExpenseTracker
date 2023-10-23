const User = require('./user.js');
const Expense = require('./expense.js');
const Order = require('./order.js');

//Association One to Many 
User.hasMany(Expense);
Expense.belongsTo(User);

//Association One to Many
User.hasMany(Order);
Order.belongsTo(User);

module.exports = { User, Expense, Order };