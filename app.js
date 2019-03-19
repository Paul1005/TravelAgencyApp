const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// Database
const db = require('./config/database');

// Test DB
db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// use express
const app = express();

// Index route
app.get('/', (req, res) => res.send('CONNECTED'));

// Flight routes
app.use('/flight', require('./routes/flight'));
app.use('/user', require('./routes/user'));
app.use('/customer', require('./routes/customer'));
app.use('/booking', require('./routes/booking'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
