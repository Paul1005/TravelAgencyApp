const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// Database
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

// Use express
const app = express();

<<<<<<< HEAD
//Handle bars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Index route
=======
// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Test connection
>>>>>>> 324779755cd21edcb242c38545e95ef2980c4039
app.get('/', (req, res) => res.send('CONNECTED'));

// Routers
app.use('/flight', require('./routes/flight'));
app.use('/user', require('./routes/user'));
app.use('/customer', require('./routes/customer'));
app.use('/booking', require('./routes/booking'));

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
