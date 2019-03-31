const express = require('express');
const router = express.Router()
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
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

/********************************************* Add a new customer *************************************************/




/********************************************** Search customers **************************************************/
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
                [Op.eq]: userIdValue
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
