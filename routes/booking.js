/* eslint-disable no-console */

// Use express dependency
const express = require('express');
// Creates a route for the booking table
const router = express.Router()

// Use the Booking Model
const Booking = require('../models/Booking');

// Use sequelize dependency
const Sequelize = require('sequelize');
// Use sequelize operators
const Op = Sequelize.Op;


/******************************************* Display all rows in the booking table ********************************/

// Url: /booking
router.get('/', (req, res) =>
    Booking.findAll()
        .then(booking => res.render('booking', {
            booking
        }))
        .catch(err => console.log(err)));


/********************************************** Add a new booking *************************************************/

// Display the form to add a new booking
router.get('/add-booking', (req, res) => res.render('add-booking'));

// Add a booking
router.post('/add-booking', (req, res) => {

    // Destructure the data object
    let { bookingDate,
        paymentAmount,
        paymentMethod,
        flightId,
        customerId,
        userId } = req.body;
    let errors = [];

    // Error handling
    if (!bookingDate) {
        errors.push({ text: 'Please add booking date' })
    }
    if (!paymentMethod) {
        errors.push({ text: 'Please add a payment method' })
    }
    if (!paymentAmount) {
        errors.push({ text: 'Please add payment amount' })
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

    // Display erros if there is any
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
    } else { // No errors, then create a new booking

        // If there is no payment amount entered, set default to 0
        if (!paymentAmount) {
            paymentAmount = 0;
        } else {
            paymentAmount = `${paymentAmount}`;
        }

        // Captitalize booking date
        bookingDate = bookingDate.charAt(0).toUpperCase() + bookingDate.slice(1);

        // Insert data into the booking table
        Booking.create({
            bookingDate,
            paymentMethod,
            paymentAmount,
            flightId,
            customerId,
            userId
        })
            // redirect back to the booking page showing all the rows if succeed
            .then(() => res.redirect('/booking'))
            // show errors if adding not succeed
            .catch(err => console.log(err));
    }
});

/********************************************** Search bookings ****************************************************/

/* Search based on:
    1. booking id only 
    2. payment amount only (search by all paymentAmount <= searched amount)
    3. booking date AND payment method
    4. all attributes together
*/
router.get('/search', (req, res) => {

    // Destructure querry object
    let { bookingIdValue } = req.query;
    let { bookingDateValue } = req.query;
    let { paymentMethodValue } = req.query;
    let { paymentAmountValue } = req.query;

    // Make them Lowercase
    bookingIdValue = bookingIdValue.toLowerCase();
    bookingDateValue = bookingDateValue.toLowerCase();
    paymentMethodValue = paymentMethodValue.toLowerCase();
    paymentAmountValue = paymentAmountValue.toLowerCase();

    /* Search by unique bookingId */
    if (bookingIdValue != '') {
        Booking.findAll({
            where: {
                // bookingId = bookingIdValue
                bookingId: { [Op.eq]: bookingIdValue }
            }
        })
            // Display the search results if succeed
            .then(booking => res.render('booking', { booking }))
            // Show errors if not succeed
            .catch(err => console.log(err));

        /* Search by specified payment amount */
    } else if (paymentAmountValue != '') {
        Booking.findAll({
            where: {
                // bookingId = [1, 1000]
                bookingId: {
                    [Op.between]: [1, 1000]
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

        /* search by specified booking date AND payment method */
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
                        [Op.lte]: 10000
                    },
                }

            } // End of Where

        }) // End of FindAll
            // Display the search results if succeed
            .then(booking => res.render('booking', { booking }))
            // Show errors if not succeed
            .catch(err => console.log(err));

    } // End of else if

}); // End of router.get('/search', (req, res)


/************************************************* Edit booking *************************************************/

// Display the form to edit a user
router.get('/edit-booking', (req, res) => res.render('edit-booking'));

// Edit a user
router.post('/edit-booking', (req, res) => {
    // destructure the data object
    let { existingBookingId,
        newBookingDate,
        newPaymentMethod,
        newPaymentAmount } = req.body;
    let errors = [];

    // Error handling
    if (!existingBookingId) {
        errors.push({ text: 'Please add an existing booking Id' })
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

    // Display erros if there is any
    if (errors.length > 0) {
        res.render('edit-booking', {
            errors,
            existingBookingId,
            newBookingDate,
            newPaymentMethod,
            newPaymentAmount
        });
    } else { // No errors, then edit a booking
        // Make Lowercase
        existingBookingId = existingBookingId.toLowerCase();
        newBookingDate = newBookingDate.toLowerCase();
        newPaymentMethod = newPaymentMethod.toLowerCase();
        newPaymentAmount = newPaymentAmount.toLowerCase();

        // Find the row in the User table
        Booking.update({
            bookingDate: newBookingDate,
            paymentMethod: newPaymentMethod,
            paymentAmount: newPaymentAmount
        }, {
                where: { // where bookingId = existingBookingId 
                    bookingId: existingBookingId
                }
            }
        )
            // Redirect to the booking page if succeed
            .then(booking => res.render('booking', { booking }))
            // Show errors if not succeed
            .catch(err => console.log(err));

    } // End of else

}); // End of router.post('/edit-booking', (req, res)


/************************************************* Delete booking *************************************************/

// Display the delete form
router.get('/delete-booking', (req, res) => res.render('delete-booking'));

// Delete a booking
router.post('/delete-booking', (req, res) => {

    // Destructure the object
    let { bookingIdDelete } = req.body;

    let errors = [];
    let successMessage = [];

    // Error handling
    if (!bookingIdDelete) {
        errors.push({ text: "Please enter an existing booking Id" });

    }

    // if there is any errors
    if (errors.length > 0) {
        res.render('delete-booking', {
            errors
        })
    } else {
        // Delete a booking
        Booking.destroy({
            // Where: bookingId = bokkingIdDelete
            where: { bookingId: bookingIdDelete }
        })
            // Error handling
            .then((deletedRecord) => {
                // If data found and deleted successfully, show a success message
                if (deletedRecord === 1) {
                    successMessage.push({ messageText: "Deleted successfully!" })
                    res.render('delete-booking', {
                        successMessage
                    })
                }
                // If not found/deleted, show an error message
                else {
                    errors.push({ text: "Booking not found. Please try again." });
                    res.render('delete-booking', {
                        errors
                    })
                }
            })
            .catch((error) => {
                res.status(500).json(error);
            });

    } // End of else

}); // End of router.post('/delete-booking', (req, res)

// Export the router
module.exports = router;
