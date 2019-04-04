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
router.get('/add-flight', (req, res) => {
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
    // Destructure querry object
    let { flightIdValue } = req.query;
    let { airlineValue } = req.query;
    let { flightDateValue } = req.query;
    let { startLocationValue } = req.query;
    let { endLocationValue } = req.query;
    let { scheduledLeavingTimeValue } = req.query;
    let { estimatedArrivalTimeValue } = req.query;

    // Make lowercase
    flightIdValue = flightIdValue.toLowerCase();
    airlineValue = airlineValue.toLowerCase();
    flightDateValue = flightDateValue.toLowerCase();
    startLocationValue = startLocationValue.toLowerCase();
    endLocationValue = endLocationValue.toLowerCase();
    scheduledLeavingTimeValue = scheduledLeavingTimeValue.toLowerCase();
    estimatedArrivalTimeValue = estimatedArrivalTimeValue.toLowerCase();

    Flight.findAll({
        where: {
            // flightId = flightIdValue OR flightIdValue = [0, 100] if exact Id not found
            flightId: {
                [Op.eq]: flightIdValue,
                [Op.between]: [0, 100]
            }, // AND
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


// Search function in Homepage
router.get('/homeSearch', (req, res) => {
    let { startLocationValue1 } = req.query;
    // make lowercase
    startLocationValue = startLocationValue1.toLowerCase();

    Flight.findAll({
        where: {
            startLocation: { [Op.like]: '%' + startLocationValue1 + '%' }
        } // End of Where
    }) // End of FindAll
        .then(flight => res.render('flight', { flight }))
        .catch(err => console.log(err));
}); // End of router.get('/search', (req, res)


// Export router
module.exports = router;
