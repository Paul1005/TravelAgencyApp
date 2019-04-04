const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Booking = require('../models/Booking');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/******************************************* Display all rows in the booking table ********************************/
router.get('/', (req, res) =>
    Booking.findAll()
        .then(booking => res.render('booking', {
            booking
        }))
        .catch(err => console.log(err)));


/********************************************** Add a new booking *************************************************/
// Display form to add a new booking
router.get('/add-booking', (req, res) => res.render('add-booking'));

// Add a booking
router.post('/add-booking', (req, res) => {
    // destructure the data object
    let { bookingDate, paymentAmount, paymentMethod, flightId, customerId, userId } = req.body;
    let errors = [];

    if (!bookingDate) {
        errors.push({ text: 'Please add booking date' })
    }
    if (!paymentAmount) {
        errors.push({ text: 'Please add payment amount' })
    }
    if (!paymentMethod) {
        errors.push({ text: 'Please add a payment method' })
    }
    if (!flightId) {
        errors.push({ text: 'Please add a flight id' })
    }
    if (!customerId) {
        errors.push({ text: 'Please add a customer id' })
    }
    if (!userId) {
        errors.push({ text: 'Please add a user id' })
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('add-booking', {
            errors,
            bookingDate,
            paymentAmount,
            paymentMethod,
            flightId,
            customerId,
            userId
        });
    } else {
        if (!paymentAmount) {
            paymentAmount = 0;
        } else {
            paymentAmount = `${paymentAmount}`;
        }

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

/********************************************** Search bookings ****************************************************/
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

    // Search unique bookingId
    if (bookingIdValue != '') {
        Booking.findAll({
            where: {
                // bookingId = bookingIdValue
                bookingId: { [Op.eq]: bookingIdValue }
            }
        })
            .then(booking => res.render('booking', { booking }))
            .catch(err => console.log(err));

        // Search all specified payment amount
    } else if (paymentAmountValue != '') {
        Booking.findAll({
            where: {
                // bookingId = [0, 100]
                bookingId: {
                    [Op.between]: [1, 100]
                }, // AND
                // Results contains bookingDateValue OR bookingDateValue = ''
                bookingDate: {
                    [Op.or]: {
                        [Op.like]: '%' + bookingDateValue + '%',
                        [Op.eq]: ''
                    }
                }, // AND
                // Results contains paymentMethodValue OR paymentMethodValue = ''
                paymentMethod: {
                    [Op.or]: {
                        [Op.like]: '%' + paymentMethodValue + '%',
                        [Op.eq]: ''
                    }
                }, // AND
                // paymentAmount <= paymentAmountValue OR paymentAmount < 5000
                paymentAmount: {
                    [Op.or]: {
                        [Op.lte]: paymentAmountValue,
                    },
                }
            } // End of Where
        }) // End of FindAll
            .then(booking => res.render('booking', { booking }))
            .catch(err => console.log(err));

        // search specified booking date OR payment method
    } else if (paymentAmountValue == '') {
        Booking.findAll({
            where: {
                // bookingId = [0, 100]
                bookingId: {
                    [Op.between]: [1, 100]
                }, // AND
                // Results contains bookingDateValue OR bookingDateValue = ''
                bookingDate: {
                    [Op.or]: {
                        [Op.like]: '%' + bookingDateValue + '%',
                        [Op.eq]: ''
                    }
                }, // AND
                // Results contains paymentMethodValue OR paymentMethodValue = ''
                paymentMethod: {
                    [Op.or]: {
                        [Op.like]: '%' + paymentMethodValue + '%',
                        [Op.eq]: ''
                    }
                }, // AND
                // paymentAmount <= paymentAmountValue OR paymentAmount < 5000
                paymentAmount: {
                    [Op.or]: {
                        [Op.lte]: 5000
                    },
                }
            } // End of Where
        }) // End of FindAll
            .then(booking => res.render('booking', { booking }))
            .catch(err => console.log(err));
    }

}); // End of router.get('/search', (req, res)

/************************************************* Edit booking *************************************************/
// Display form to edit a user
router.get('/edit-booking', (req, res) => res.render('edit-booking'));

// Edit a user
router.post('/edit-booking', (req, res) => {
    // destructure the data object
    let { existingBookingId, newBookingDate, newPaymentMethod, newPaymentAmount } = req.body;
    let errors = [];

    // Error handling
    if (!existingBookingId) {
        errors.push({ text: 'Please add a new booking id' })
    }
    if (!newBookingDate) {
        errors.push({ text: 'Please add a new booking date' })
    }
    if (!newPaymentMethod) {
        errors.push({ text: 'Please add a new payment method' })
    }
    if (!newPaymentAmount) {
        errors.push({ text: 'Please add a new payment amount' })
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('edit-booking', {
            errors,
            existingBookingId,
            newBookingDate,
            newPaymentMethod,
            newPaymentAmount
        });
    } else {
        // Make data lowercase
        existingBookingId = existingBookingId.toLowerCase();
        newBookingDate = newBookingDate.toLowerCase();
        newPaymentMethod = newPaymentMethod.toLowerCase();
        newPaymentAmount = newPaymentAmount.toLowerCase();

        // Find the row in the User table
        Booking.update({
            bookingDate: newBookingDate,
            paymentMethod: newPaymentMethod,
            paymentAmount: newPaymentAmount
        },
            {
                // Where clause
                where: {
                    bookingId: existingBookingId
                }
            }
        )
            .then(booking => res.redirect('/booking'))
            .catch(err => console.log(err));
    } // End of else
});

/************************************************* Delete booking *************************************************/
router.get('/delete-booking', (req, res) => res.render('delete-booking'));

router.post('/delete-booking', (req, res) => {
    let { bookingIddelete } = req.body;
    Booking.destroy({
        where: { bookingId: bookingIddelete }
    }).then(booking => res.redirect('/booking'))
        .catch(err => console.log(err));
});

/* const Handlebars = require('handlebars');
Handlebars.registerHelper('deletebooking', function (id) {
    Booking.destroy({
        where: {bookingId :id }
    }).then(booking => res.redirect('/booking'))
    .catch(err => console.log(err));
});*/



// Export router
module.exports = router;
