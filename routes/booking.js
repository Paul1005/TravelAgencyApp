const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Booking = require('../models/Booking');
const Sequelize = require ('sequelize');
const Op = Sequelize.Op;

// find all the rows in the booking table 
router.get('/', (req, res) => 
    Booking.findAll()
        .then(booking => res.render('booking',{
               booking
           }))
        .catch(err => console.log(err)));

// // find the row(s) in booking table where the payment method is Credit
// router.get('/', (req, res) => 
//     Booking.findAll({where: {paymentMethod: 'Credit'}})
//         .then(booking => {
//             res.render('booking', {
//                 booking
//             });
//         })
//         .catch(err => console.log(err)));


// Display add booking form
router.get('/add', (req, res) => res.render('add'));

//add booking
router.post('/add', (req, res) => {
    // destructure the data object
    let { bookingDate, paymentAmount, paymentMethod, flightId, customerId, userId } = req.body;
    let errors = [];
    
    if(!bookingDate) {
        errors.push({ text: 'Please add booking date'})
    }
    if(!paymentAmount) {
        errors.push({ text: 'Please add payment amount'})
    }
    if(!paymentMethod) {
        errors.push({ text: 'Please add a payment method'})
    }
    if(!flightId) {
        errors.push({ text: 'Please add a flight id'})
    }
    if(!customerId) {
        errors.push({ text: 'Please add a customer id'})
    }
    if(!userId) {
        errors.push({ text: 'Please add a user id'})
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('add', {
            errors,
            bookingDate, 
            paymentAmount, 
            paymentMethod, 
            flightId, 
            customerId, 
            userId
        });
    } else {
        if(!paymentAmount) {
            paymentAmount = 0;
        } else {
            paymentAmount = `${paymentAmount}`;
        }
        
        // Make paymentMethod lowercase and remove space after comma
        paymentMethod = paymentMethod.toLowerCase().replace(/, /g, ',');
        
        // Insert data into the flight table
        Booking.create({
            bookingDate, 
            paymentAmount, 
            paymentMethod, 
            flightId, 
            customerId, 
            userId
        })
            .then(booking => res.redirect('/booking'))
            .catch(err => console.log(err));
        }
    });

// Search for bookings
router.get('/search', (req, res) => {
    // destructure querry object
    let { bookingIdValue } = req.query;
    let { bookingDateValue } = req.query;
    let { paymentMethodValue } = req.query;
    let { paymentAmountValue } = req.query;

    // Make lowercase
    bookingIdValue = bookingIdValue.toLowerCase();
    bookingDateValue = bookingDateValue.toLowerCase();
    paymentMethodValue = paymentMethodValue.toLowerCase();
    paymentAmountValue = paymentAmountValue.toLowerCase();

    Booking.findAll({ 
        where: {
            // booking Id = bookingIdValue
            bookingId: {
                [Op.eq]: bookingIdValue
            }, // AND
            // results contains bookingDateValue OR bookingDateValue = ''
            bookingDate: { 
                [Op.or]: {
                    [Op.like]: '%' + bookingDateValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains paymentMethodValue OR paymentMethodValue = ''
            paymentMethod: { 
                [Op.or]: {
                    [Op.like]: '%' + paymentMethodValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // paymentAmount <= paymentAmountValue OR paymentAmount < 5000
            paymentAmount: { 
                [Op.or]: {
                    [Op.eq]: paymentAmountValue,
                    [Op.lt]: 5000
                }
            },
        }
    })
    .then(booking => res.render('booking', { booking }))
    .catch(err => console.log(err));
});

module.exports = router;
