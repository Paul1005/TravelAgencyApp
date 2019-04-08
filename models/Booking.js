// Use sequelize dependency
const Sequelize = require('sequelize');
// Use database
const db = require('../config/database');

// Define the Booking Model 
const Booking = db.define('booking', {
    /* 7 attributes (including 3 Fks */
    bookingId: { // Integer, NOT NULL
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingDate: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    paymentAmount: { // Integer, NOT NULL
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paymentMethod: { // String, NOT NULL
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: { // Integer, NOT NULL
        type: Sequelize.INTEGER,
        allowNull: false
    },
    customerId: { // Integer, NOT NULL
        type: Sequelize.INTEGER,
        allowNull: false
    },
    flightId: { // Integer, NOT NULL
        type: Sequelize.INTEGER,
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
        tableName: 'booking',
    });

Booking.associate = function (models) {
    models.Booking.belongsTo(models.Customer, {
        onDelete: "CASCADE",
        hooks: true,
        foreignKey: 'customerId'
    });
}

Booking.associate = function (models) {
    models.Booking.belongsTo(models.Flight, {
        foreignKey: 'flightId',
    });
}

Booking.associate = function (models) {
    models.Booking.belongsTo(models.User, {
        foreignKey: 'userId',
    });
}

// Export the Booking Model
module.exports = Booking;
