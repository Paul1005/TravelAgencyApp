const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Flight = require('../models/Flight');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/******************************************** Display all rows in the flight table ********************************/
router.get('/', (req, res) =>
    Flight.findAll()
        .then(flight => {
            res.render('flight', {
                flight
            });
        })
        .catch(err => console.log(err)));


/********************************************** Test adding a flight **********************************************/
router.get('/add', (req, res) => {
    const data = {
        airline: 'Boring JS Airline',
        flightDate: 'Mar-30-2019',
        startLocation: 'Vancouver',
        endLocation: 'Los Angeles',
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

/********************************************** Search flights ****************************************************/
router.get('/search', (req, res) => {
    let { airlineValue } = req.query;
    let { flightDateValue } = req.query;
    let { startLocationValue } = req.query;
    let { endLocationValue } = req.query;
    let { scheduledLeavingTimeValue } = req.query;
    let { estimatedArrivalTimeValue } = req.query;
    // make lowercase
    airlineValue = airlineValue.toLowerCase();
    flightDateValue = flightDateValue.toLowerCase();
    startLocationValue = startLocationValue.toLowerCase();
    endLocationValue = endLocationValue.toLowerCase();
    scheduledLeavingTimeValue = scheduledLeavingTimeValue.toLowerCase();
    estimatedArrivalTimeValue = estimatedArrivalTimeValue.toLowerCase();

    Flight.findAll({
        where: {
            // results contains airlineValue OR ''
            airline: {
                [Op.or]: {
                    [Op.like]: '%' + airlineValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains flightDateValue OR ''
            flightDate: {
                [Op.or]: {
                    [Op.like]: '%' + flightDateValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains startLocationValue OR ''
            startLocation: {
                [Op.or]: {
                    [Op.like]: '%' + startLocationValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains endLocationValue OR ''
            endLocation: {
                [Op.or]: {
                    [Op.like]: '%' + endLocationValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains scheduledLeavingTimeValue OR ''
            scheduledLeavingTime: {
                [Op.or]: {
                    [Op.like]: '%' + scheduledLeavingTimeValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains estimatedArrivalTimeValue OR ''
            estimatedArrivalTime: {
                [Op.or]: {
                    [Op.like]: '%' + estimatedArrivalTimeValue + '%',
                    [Op.eq]: ''
                }
            }
        } // End of Where
    }) // End of FindAll
        .then(flight => res.render('flight', { flight }))
        .catch(err => console.log(err));
}); // End of router.get('/search', (req, res)

module.exports = router;
