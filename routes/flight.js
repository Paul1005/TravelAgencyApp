const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Flight = require('../models/Flight');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Find all the rows in the flight table 
router.get('/', (req, res) => 
    Flight.findAll()
        .then(flight => {
            res.render('flight', {
                flight
            });
        })
        .catch(err => console.log(err)));

// Test adding a row
router.get('/add', (req, res) => {
    const data = {
        airline: 'Boring JS Airline',
        flightDate: 'Mar-30-2019',
        startLocation: 'Vancouver',
        endLocation: 'Italy',
        scheduledLeavingTime: '12:00',
        estimatedArrivalTime: '23:00'
    }

    // destructure the data object
    let { airline, flightDate, startLocation, endLocation, scheduledLeavingTime, estimatedArrivalTime } = data;

    // Insert data into the flight table
    Flight.create({
        airline,
        flightDate,
        startLocation,
        endLocation,
        scheduledLeavingTime,
        estimatedArrivalTime
    })
        .then(flight => res.redirect('/flight'))
        .catch(err => console.log(err));
});

// Search for flights
router.get('/search', (req, res) => {
    let { airlineValue } = req.query || '';
    let { flightDateValue } = req.query || '';
    let { startLocationValue } = req.query || '';
    let { endLocationValue } = req.query || '';
    let { scheduledLeavingTimeValue } = req.query || '';
    let { estimatedArrivalTimeValue } = req.query || '';
    // make lowercase
    // airlineValue = airlineValue.toLowerCase();
    // flightDateValue = flightDateValue.toLowerCase();
    // startLocationValue = startLocationValue.toLowerCase();
    // endLocationValue = endLocationValue.toLowerCase();
    // scheduledLeavingTimeValue = scheduledLeavingTimeValue.toLowerCase();
    // estimatedArrivalTimeValue = estimatedArrivalTimeValue.toLowerCase();

    Flight.findAll({
            where: {
                airline: {[Op.like]: '%' + airlineValue + '%'},
                flightDate: {[Op.like]: '%' + flightDateValue + '%'},
                startLocation: {[Op.like]: '%' + startLocationValue + '%'},
                endLocation: {[Op.like]: '%' + endLocationValue + '%'},
                scheduledLeavingTime: {[Op.like]: '%' + scheduledLeavingTimeValue + '%'},
                estimatedArrivalTime: { [Op.like]: '%' + estimatedArrivalTimeValue +'%' }
            }
        })
        .then(flight => res.render('flight', { flight }))
        .catch(err => console.log(err));
});

module.exports = router;
