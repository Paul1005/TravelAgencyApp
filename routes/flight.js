/* eslint-disable no-console */

// Use express dpendency
const express = require('express');
// Creates a route for the flight table
const router = express.Router()

// Use the Flight Model
const Flight = require('../models/Flight');

// Use sequelize dependency
const Sequelize = require('sequelize');
// Use sequelize operators
const Op = Sequelize.Op;


/******************************************** Display all rows in the flight table ********************************/

// Url: /flight
router.get('/', (req, res) =>
    Flight.findAll()
        .then(flight => {
            res.render('flight', {
                flight
            });
        })
        .catch(err => console.log(err)));


/********************************************** Test adding a flight **********************************************/

// Add a flight
router.get('/add-flight', (req, res) => {
    const data = {
        airline: 'Boring JS Airline',
        flightDate: 'Mar-30-2019',
        startLocation: 'Vancouver',
        endLocation: 'Los Angeles',
        scheduledLeavingTime: '12:00',
        estimatedArrivalTime: '23:00'
    }

    // Destructure the data object
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
        .then(() => res.redirect('/flight'))
        .catch(err => console.log(err));
});

/********************************************** Search flights ****************************************************/
/* Search based on:
    1. flight id only 
    4. all attributes together
*/
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

    /* Search by unique flightId */
    if (flightIdValue != '') {
        Flight.findAll({
            where: {
                // flightId = flightIdValue OR flightIdValue = [0, 100] if exact Id not found
                flightId: { [Op.eq]: flightIdValue }
            }
        })
            // Display the search results if succeed
            .then(flight => res.render('flight', { flight }))
            // Show errors if not succeed
            .catch(err => console.log(err));

        /* Search by other attributes */
    } else {
        Flight.findAll({
            where: {
                // flight id = [1, 1000]
                flightId: {
                    [Op.between]: [1, 1000]
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

            // Display the search results if succeed
            .then(flight => res.render('flight', { flight }))
            // Show errors if not succeed
            .catch(err => console.log(err));

    } // End of else 

}); // End of router.get('/search', (req, res)


// Search function in Homepage
router.get('/homeSearch', (req, res) => {

    // Destructure query object 
    let { startLocationValue1 } = req.query;

    // Make lowercase
    startLocationValue1 = startLocationValue1.toLowerCase();

    // Search by start location
    Flight.findAll({
        where: {
            startLocation: { [Op.like]: '%' + startLocationValue1 + '%' }
        } // End of Where
    }) // End of FindAll
        // Display the search results if succeed
        .then(flight => res.render('flight', { flight }))
        // Show errors if not succeed
        .catch(err => console.log(err));

}); // End of router.get('/search', (req, res)


// Export router
module.exports = router;
