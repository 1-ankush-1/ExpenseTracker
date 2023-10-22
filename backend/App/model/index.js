const User = require('./user.js');
const Expense = require('./expense.js');

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = { User, Expense };