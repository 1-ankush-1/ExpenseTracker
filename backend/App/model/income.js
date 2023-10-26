const Sequelize = require("sequelize");
const sequelize = require("../config/connect.js");

const Income = sequelize.define('income', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amt: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
})


module.exports = Income;