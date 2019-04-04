// Use squelize dependency
const Sequelize = require('sequelize');
// Use database 
const db = require('../config/database');

// Define the Flight Model
const Flight = db.define('flight', {
    // 7 attributes
    flightId: { // Integer, AUTO_INCREMENT, PRIMARY KEY
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    airline: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    flightDate: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    startLocation: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    endLocation: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    scheduledLeavingTime: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    estimatedArrivalTime: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    }
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
        tableName: 'flight',

    })

// Export the Flight Model
module.exports = Flight;
