// Use squelize dependency
const Sequelize = require('sequelize');
// Use database 
const db = require('../config/database');

// Define the Customer Model
const Customer = db.define('customer', {
    // 6 attributes
    customerId: { // Integer, AUTO_INCREMENT, PRIMARY KEY
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    email: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    telephone: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    address: { // String, NOT NULL
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
        tableName: 'customer',

    });

// 1:M relationship with Booking
Customer.associate = function (models) {
    models.Customer.hasMany(models.Booking, {
        foreignKey: 'customerId'
    });
};

// Export the Customer Model
module.exports = Customer;
