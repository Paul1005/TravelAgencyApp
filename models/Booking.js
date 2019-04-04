const Sequelize = require('sequelize');
const db = require('../config/database');
const Customer = require('./Customer');
const Flight = require('./Flight');
const User = require('./User');

const Booking = db.define('booking', {
    /* attributes */
    bookingId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingDate: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paymentAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    customerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    flightId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
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
        tableName: 'booking',
    });

/* Foreign keys */
Booking.hasMany(Customer, {
    foreignKey: {
        name: 'customerId',
        allowNull: false
    }
})
Booking.hasMany(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
})
Booking.hasMany(Flight, {
    foreignKey: {
        name: 'flightId',
        allowNull: false
    }
})

module.exports = Booking;
