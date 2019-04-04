const express = require('express');
const router = express.Router()
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const fs = require('fs');
const Op = Sequelize.Op;

/****************************************** Display all rows in the user table ************************************/
router.get('/', (req, res) =>
    User.findAll()
        .then(user => {
            res.render('user', {
                user
            });
        })
        .catch(err => console.log(err)));

/********************************************* Add a new user *************************************************/
// Display form to add a new user
router.get('/add-user', (req, res) => res.render('add-user'));

// Add a user
router.post('/add-user', (req, res) => {
    // destructure the data object
    let { userName, userPassword } = req.body;
    let errors = [];

    if (!userName) {
        errors.push({ text: 'Please add a user name' })
    }
    if (!userPassword) {
        errors.push({ text: 'Please add a user password' })
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('add', {
            errors,
            userName,
            userPassword
        });
    } else {
        // Make data lowercase
        userName = userName.toLowerCase();
        userPassword = userPassword.toLowerCase();

        // Insert data into the User table
        User.create({
            userName,
            userPassword
        })
            .then(user => res.redirect('/user'))
            .catch(err => console.log(err));
    }
});

/********************************************** Search user **************************************************/
router.get('/search', (req, res) => {
    // Destructure query objects
    let { userIdValue } = req.query;
    let { userNameValue } = req.query;
    let { userPasswordValue } = req.query;

    // Make lowercase
    userIdValue = userIdValue.toLowerCase();
    userNameValue = userNameValue.toLowerCase();
    userPasswordValue = userPasswordValue.toLowerCase();

    User.findAll({
        where: {
            // userId = userIdValue
            userId: {
                [Op.or]: {
                    [Op.eq]: userIdValue,
                    [Op.between]: [0, 100]
                }
            }, // AND
            // results contains userNameValue OR ''
            userName: {
                [Op.or]: {
                    [Op.like]: '%' + userNameValue + '%',
                    [Op.eq]: ''
                }
            }, // AND
            // results contains userPasswordValue OR ''
            userPassword: {
                [Op.or]: {
                    [Op.like]: '%' + userPasswordValue + '%',
                    [Op.eq]: ''
                }
            }
        } // End of Where
    }) // End of FindAll
        .then(user => res.render('user', { user }))
        .catch(err => console.log(err));
}); // End of router.get('/search', (req, res)

module.exports = router;
