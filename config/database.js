// Use sequelize dependency
const Sequelize = require('sequelize');

// Create a connection to the databaes
// which is hosted on AWS
module.exports = new Sequelize('travelAgency', 'kbrowne', 'kyle3694', {
    host: 'travelagencyapp.cowhr4azo6wx.us-west-1.rds.amazonaws.com', // database enedpoint
    dialect: 'mysql', // using mysql
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});