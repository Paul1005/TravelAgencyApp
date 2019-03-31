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
                [Op.eq]: customerIdValue
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

// Export router
module.exports = router;
