/* eslint-disable no-console */

// Use express dpendency
const express = require('express');
// Creates a route for the booking table
const router = express.Router()

// Use the Customer Model
const Customer = require('../models/Customer');

// Use sequelize dependency
const Sequelize = require('sequelize');
// Use sequelize operators
const Op = Sequelize.Op;


/****************************************** Display all rows in the customer table ********************************/
// Url: /customer
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
    let { firstName,
        lastName,
        email,
        telephone,
        address } = req.body;
    let errors = [];

    // Error handling
    if (!firstName) {
        errors.push({ text: 'Please add first name' })
    }
    if (!lastName) {
        errors.push({ text: 'Please add last name' })
    }
    if (!email) {
        errors.push({ text: 'Please add email' })
    }
    if (!telephone) {
        errors.push({ text: 'Please add telephone' })
    }
    if (!address) {
        errors.push({ text: 'Please add address' })
    }

    // Display erros if there is any
    if (errors.length > 0) {
        res.render('add-customer', {
            errors,
            firstName,
            lastName,
            email,
            telephone,
            address
        });
    } else { // No errors, then create a new customer

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
            // redirect back to the customer page showing all the rows if succeed
            .then(() => res.redirect('/customer'))
            // show errors if adding not succeed
            .catch(err => console.log(err));
    }
});


/********************************************** Search customers **************************************************/
/* Search based on:
    1. booking id only 
    2. payment amount only (search by all paymentAmount <= searched amount)
    3. booking date AND payment method
    4. all attributes together
*/
router.get('/search', (req, res) => {

    // Destructure querry object
    let { customerIdValue } = req.query;
    let { firstNameValue } = req.query;
    let { lastNameValue } = req.query;
    let { emailValue } = req.query;
    let { telephoneValue } = req.query;
    let { addressValue } = req.query;

    // Make Lowercase
    customerIdValue = customerIdValue.toLowerCase();
    firstNameValue = firstNameValue.toLowerCase();
    lastNameValue = lastNameValue.toLowerCase();
    emailValue = emailValue.toLowerCase();
    telephoneValue = telephoneValue.toLowerCase();
    addressValue = addressValue.toLowerCase();

    /* Search by unique customerId */
    if (customerId != '') {
        Customer.findAll({
            where: {
                // customerId = customerIdValue
                customerId: {
                    [Op.eq]: customerIdValue,
                    [Op.between]: [0, 100]
                }
            }
        })
            .then(customer => res.render('customer', { customer }))
            .catch(err => console.log(err));

    } else {
        Customer.findAll({
            where: {
                // customerId = [1, 1000]
                customerId: {
                    [Op.between]: [1, 1000]
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

/************************************************* Edit booking *************************************************/
// Display form to edit a user
router.get('/edit-customer', (req, res) => res.render('edit-customer'));

// Edit a user
router.post('/edit-customer', (req, res) => {
    // destructure the data object
    let { existingCustomerId, newFirstName, newLastName, newEmail, newTelephone, newAddress } = req.body;
    let errors = [];

    // Error handling
    if (!existingCustomerId) {
        errors.push({ text: 'Please add an existing customer id' })
    }
    if (!newFirstName) {
        errors.push({ text: 'Please add a new first name' })
    }
    if (!newLastName) {
        errors.push({ text: 'Please add a new last name' })
    }
    if (!newEmail) {
        errors.push({ text: 'Please add a new email' })
    }
    if (!newTelephone) {
        errors.push({ text: 'Please add a new telephone number' })
    }
    if (!newAddress) {
        errors.push({ text: 'Please add a new address' })
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('edit-customer', {
            errors,
            existingCustomerId,
            newFirstName,
            newLastName,
            newEmail,
            newTelephone,
            newAddress
        });
    } else {
        // Make data lowercase
        existingCustomerId = existingCustomerId.toLowerCase();
        newFirstName = newFirstName.toLowerCase();
        newLastName = newLastName.toLowerCase();
        newEmail = newEmail.toLowerCase();
        newTelephone = newTelephone.toLowerCase();
        newAddress = newAddress.toLowerCase();

        // Find the row in the User table
        Customer.update({
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            telephone: newTelephone,
            address: newAddress
        },
            {
                // Where clause
                where: {
                    customerId: existingCustomerId
                }
            }
        )
            .then(customer => res.redirect('/customer'))
            .catch(err => console.log(err));
    } // End of else
});


/************************************************* Delete booking *************************************************/
router.get('/delete-customer', (req, res) => res.render('delete-customer'));

router.post('/delete-customer', (req, res) => {
    let { customerIdDelete } = req.body;
    Customer.destroy({
        where: { customerId: customerIdDelete }
    })
        .then(customer => res.redirect('/customer'))
        .catch(err => console.log(err));
});


// Export router
module.exports = router;
