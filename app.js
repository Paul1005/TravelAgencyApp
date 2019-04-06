/* eslint-disable no-console */
// Use express dependency
const express = require('express');
// Use express-handlebars dependency
const exphbs = require('express-handlebars');
// Use body-parser dependency
const bodyParser = require('body-parser');
// Use path dependency
const path = require('path');

// Use express
const app = express();

// Use handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set PORT
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// Set static folder
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

// Use Database
const db = require('./config/database');

// Test database
db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Index route
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

// Ohter routes
app.use('/flight', require('./routes/flight'));
app.use('/user', require('./routes/user'));
app.use('/customer', require('./routes/customer'));
app.use('/booking', require('./routes/booking'));

