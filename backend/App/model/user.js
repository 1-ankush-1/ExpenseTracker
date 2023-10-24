const Sequelize = require("sequelize");
const sequelize = require("../config/connect.js");

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    totalexpenses: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    }
})

module.exports = User;
