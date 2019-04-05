/* eslint-disable no-console */

// Use express dpendency
const express = require('express');
// Creates a route for the user table
const router = express.Router()

// Use the User Model
const User = require('../models/User');

// Use sequelize dependency
const Sequelize = require('sequelize');
// Use sequelize operators
const Op = Sequelize.Op;


/****************************************** Display all rows in the user table ************************************/

// Url: /user
router.get('/', (req, res) =>
    User.findAll()
        .then(user => {
            res.render('user', {
                user
            });
        })
        .catch(err => console.log(err)));

/********************************************* Add a new user *************************************************/

// Display the form to add a new user
router.get('/add-user', (req, res) => res.render('add-user'));

// Add a user
router.post('/add-user', (req, res) => {

    // Destructure the data object
    let { userName, userPassword } = req.body;
    let errors = [];

    // Error handling
    if (!userName) {
        errors.push({ text: 'Please add user name' })
    }
    if (!userPassword) {
        errors.push({ text: 'Please add user password' })
    }

    // Display erros if there is any
    if (errors.length > 0) {
        res.render('add-user', {
            errors,
            userName,
            userPassword
        });
    } else { // No errors, then create a new user

        // Make data lowercase
        userName = userName.toLowerCase();
        userPassword = userPassword.toLowerCase();

        // Insert data into the User table
        User.create({
            userName,
            userPassword
        })
            // redirect back to the user page showing all the rows if succeed
            .then(() => res.redirect('/user'))
            // Show errors if not succeed
            .catch(err => console.log(err));
    }
});

/********************************************** Search user **************************************************/

/* Search based on:
    1. user id only
    2. other attributes together
*/
router.get('/search', (req, res) => {
    // Destructure query objects
    let { userIdValue } = req.query;
    let { userNameValue } = req.query;
    let { userPasswordValue } = req.query;

    // Make lowercase
    userIdValue = userIdValue.toLowerCase();
    userNameValue = userNameValue.toLowerCase();
    userPasswordValue = userPasswordValue.toLowerCase();

    /* Search by userId */
    if (userIdValue != '') {
        User.findAll({
            where: {
                // userId = userIdValue
                userId: { [Op.eq]: userIdValue }
            }
        })
            // Display the search results if succeed
            .then(user => res.render('user', { user }))
            // Show errors if not succeed
            .catch(err => console.log(err));

        /* Search by other attributes */
    } else {
        User.findAll({
            where: {
                userId: {
                    [Op.between]: [1, 1000]
                },
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
            // Display the search results if succeed
            .then(user => res.render('user', { user }))
            // Show errors if not succeed
            .catch(err => console.log(err));

    } // End of else 

}); // End of router.get('/search', (req, res)


/********************************************* Edit a user *************************************************/

// Display form to edit a user
router.get('/edit-user', (req, res) => res.render('edit-user'));

// Edit a user
router.post('/edit-user', (req, res) => {

    // Destructure the data object
    let { existingUserId, newUserName, newUserPassword } = req.body;
    let errors = [];

    // Error handling
    if (!existingUserId) {
        errors.push({ text: 'Please add a new user name' })
    }
    if (!newUserName) {
        errors.push({ text: 'Please add a new user name' })
    }
    if (!newUserPassword) {
        errors.push({ text: 'Please add a new user password' })
    }

    // Display erros if there is any
    if (errors.length > 0) {
        res.render('add', {
            errors,
            existingUserId,
            newUserName,
            newUserPassword
        });
    } else { // No errors, then edit a booking
        // Make data lowercase
        existingUserId = existingUserId.toLowerCase();
        newUserName = newUserName.toLowerCase();
        newUserPassword = newUserPassword.toLowerCase();

        // Find the row in the User table
        User.update({
            userName: newUserName,
            userPassword: newUserPassword
        },
            {
                // Where: userId = existingUserId
                where: {
                    userId: existingUserId
                }
            }
        )
            // Redirect back to the user page if succeed
            .then(() => res.redirect('/user'))
            // Show errors if not succeed
            .catch(err => console.log(err));

    } // End of else

}); // End of router.get('/edit-user', (req, res)

module.exports = router;
