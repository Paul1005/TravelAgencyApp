const express = require('express');
const router = express.Router()
const db = require('../config/database');
const Customer = require('../models/Customer');

// find all the rows in the customer table 
router.get('/', (req, res) => 
    Customer.findAll()
        .then(customer => {
            // console.log(customer)
            // res.sendStatus(200);
            res.render('customer', {
                        customer
                    });
        })
        .catch(err => console.log(err)));

// find the row(s) in flight table where the name is Sally
router.get('/', (req, res) => 
    Customer.findOne({where: {firstName: 'Sally'}})
        .then(cutomer => {
            console.log(customer)
            res.sendStatus(200);
        })
        .catch(err => console.log(err)));

module.exports = router;
