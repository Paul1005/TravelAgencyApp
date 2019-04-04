const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Customer = require('../models/Customer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/****************************************** Display all rows in the customer table ********************************/
router.get('/', (req, res) =>
    Customer.findAll()
        .then(customer => {
            res.render('customer', {
                customer
            });
        })
        .catch(err => console.log(err)));

/********************************************* Add a new customer *************************************************/
// Display form to add a new customer
router.get('/add-customer', (req, res) => res.render('add-customer'));

// Add a customer
router.post('/add-customer', (req, res) => {
    // destructure the data object
    let { firstName, lastName, email, telephone, address } = req.body;
    let errors = [];

    if (!firstName) {
        errors.push({ text: 'Please add a first name' })
    }
    if (!lastName) {
        errors.push({ text: 'Please add a last name' })
    }
    if (!email) {
        errors.push({ text: 'Please add an email' })
    }
    if (!telephone) {
        errors.push({ text: 'Please add a telephone' })
    }
    if (!address) {
        errors.push({ text: 'Please add an address' })
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('add', {
            errors,
            firstName,
            lastName,
            email,
            telephone,
            address
        });
    } else {

        // Make data lowercase
        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();
        email = email.toLowerCase();
        telephone = telephone.toLowerCase();
        address = address.toLowerCase();

        // Insert data into the customer table
        Customer.create({
            firstName,
            lastName,
            email,
            telephone,
            address
        })
            .then(customer => res.redirect('/customer'))
            .catch(err => console.log(err));
    }
});


/********************************************** Search customers **************************************************/
router.get('/search', (req, res) => {
    // Destructure querry object
    let { customerIdValue } = req.query;
    let { firstNameValue } = req.query;
    let { lastNameValue } = req.query;
    let { emailValue } = req.query;
    let { telephoneValue } = req.query;
    let { addressValue } = req.query;

    // Make lowercase
    customerIdValue = customerIdValue.toLowerCase();
    firstNameValue = firstNameValue.toLowerCase();
    lastNameValue = lastNameValue.toLowerCase();
    emailValue = emailValue.toLowerCase();
    telephoneValue = telephoneValue.toLowerCase();
    addressValue = addressValue.toLowerCase();

    Customer.findAll({
        where: {
            // customerId = customerIdValue
            customerId: {
                [Op.or]: {
                    [Op.eq]: customerIdValue,
                    [Op.between]: [0, 100]
                }
            }, // AND
            // Results contains firstNameValue OR firstNameValue = ''
            firstName: {
                [Op.or]: {
                    [Op.like]: '%' + firstNameValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // Results contains lastNameValue OR lastNameValue = ''
            lastName: {
                [Op.or]: {
                    [Op.like]: '%' + lastNameValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // Results contains emailValue OR emailValue = ''
            email: {
                [Op.or]: {
                    [Op.like]: '%' + emailValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // Results contains emailValue OR emailValue = ''
            telephone: {
                [Op.or]: {
                    [Op.like]: '%' + telephoneValue + '%',
                    [Op.eq]: ''
                }
            }, // AND 
            // Results contains addressValue OR addressValue = ''
            address: {
                [Op.or]: {
                    [Op.like]: '%' + addressValue + '%',
                    [Op.eq]: ''
                }
            }
        } // End of Where
    }) // End of FindAll
        .then(customer => res.render('customer', { customer }))
        .catch(err => console.log(err));
}); // End of router.get('/search', (req, res)

//*****Edit Customer*****/
router.get('/edit-customer', (req, res) => res.render('edit-customer'));

// router.post('/edit-customer', (req, res) => {
//     let {
//         bookingIddelete
//     } = req.body;
//     Booking.destroy({
//             where: {
//                 bookingId: bookingIddelete
//             }
//         }).then(booking => res.redirect('/booking'))
//         .catch(err => console.log(err));
// });

// Export router
module.exports = router;
