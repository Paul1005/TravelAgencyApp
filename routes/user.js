const express = require('express');
const router = express.Router()
const db = require('../config/database');
const User = require('../models/User');

// find all the rows in the flight table 
router.get('/', (req, res) => 
    User.findAll()
        .then(user => {
            /* 
            console.log(user)
            res.sendStatus(200); 
            */
           res.render('user', {
               user
           });
        })
        .catch(err => console.log(err)));
// find the row(s) in flight table where the startLocation is Vancouver
// router.get('/', (req, res) => 
//     Flight.findOne({where: {userName: "Patrick111"}})
//         .then(flight => {
//             console.log(user)
//             res.sendStatus(200);
//         })
//         .catch(err => console.log(err)));

module.exports = router;
