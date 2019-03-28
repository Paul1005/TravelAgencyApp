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
            /* 
            console.log(flight)
            res.sendStatus(200); 
            */
            res.render('flight', {
                flight
            });
        })
        .catch(err => console.log(err)));

// Find row(s) in the flight table where startLocation is Vancouver
// router.get('/', (req, res) => 
//     Flight.findOne({where: {startLocation: 'Vancouver'}})
//         .then(flight => {
//             console.log(flight)
//             res.sendStatus(200);
//         })
//         .catch(err => console.log(err)));

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
    let {
        term
    } = req.query;

    // Make lowercase
    term = term.toLowerCase();

    Flight.findAll({
            where: {
                startLocation: {
                    [Op.like]: '%' + term + '%'
                }
            }
        })
        .then(flight => res.render('flight', {
            flight
        }))
        .catch(err => console.log(err));
});

module.exports = router;
