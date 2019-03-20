const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    /* attributes */
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userPassword: {
        type: Sequelize.STRING,
        allowNull: false
    },
  }, {
      // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,

    // Will automatically set field option for all attributes to snake cased name.
    // Does not override attribute with field option already defined
    underscored: true,

    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'user',

    });

module.exports = User;