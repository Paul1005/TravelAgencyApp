const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Flight = require('../models/Flight');

// find all the rows in the flight table 
router.get('/', (req, res) => 
    Flight.findAll()
        .then(flight => {
            console.log(flight)
            res.sendStatus(200);
        })
        .catch(err => console.log(err)));

// find the row(s) in flight table where the startLocation is Vancouver
router.get('/', (req, res) => 
    Flight.findOne({where: {startLocation: 'Vancouver'}})
        .then(flight => {
            console.log(flight)
            res.sendStatus(200);
        })
        .catch(err => console.log(err)));

module.exports = router;
