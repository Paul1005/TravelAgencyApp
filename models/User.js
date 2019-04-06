// Use squelize dependency
const Sequelize = require('sequelize');
// Use database 
const db = require('../config/database');

// Define the User Model
const User = db.define('user', {
    /* 3 attributes */
    userId: { // Integer, AUTO_INCREMENT, PRIMARY KEY
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    userPassword: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
        // Don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,

        // Don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,

        // Will automatically set field option for all attributes to snake cased name.
        // Does not override attribute with field option already defined
        underscored: true,

        // Disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // Define the table's name
        tableName: 'user',

    });

// 1:M relationship with Booking
User.associate = function (models) {
    models.User.hasMany(models.Booking, {
        foreignKey: 'userId'
    });
};

// Export the User Model
module.exports = User;
