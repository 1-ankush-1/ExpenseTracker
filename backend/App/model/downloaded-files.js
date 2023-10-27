const Sequelize = require("sequelize");
const sequelize = require("../config/connect.js");

const DownloadedFile = sequelize.define('downloadedfile', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileurl: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})


module.exports = DownloadedFile;