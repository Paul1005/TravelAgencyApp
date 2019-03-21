const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Booking = require('../models/Booking');

// find all the rows in the booking table 
router.get('/', (req, res) => 
    Booking.findAll()
        .then(booking => {
            /*
            console.log(booking)
            res.sendStatus(200);
            */
           res.render('booking',{
               booking
           });
        })
        .catch(err => console.log(err)));

// find the row(s) in flight table where the startLocation is Vancouver
router.get('/', (req, res) => 
    Booking.findOne({where: {paymentMethod: Credit}})
        .then(booking => {
            console.log(booking)
            res.sendStatus(200);
        })
        .catch(err => console.log(err)));


//add booking

module.exports = router;
