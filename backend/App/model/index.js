const User = require('./user.js');
const Expense = require('./expense.js');

//Association One to Many 
User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = { User, Expense };