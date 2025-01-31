const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport'); /**/
const flash = require('connect-flash');/**/
const layout = require('express-ejs-layouts');
const cors = require('cors');/**/
const path = require('path');
const app = express();




const port = process.env.PORT || 8080;

// Database and Passport configuration
require('./config/passport')(passport); /**/

// Middleware setup
app.use(morgan('dev')); // Log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(layout);
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(cors()); /**/

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Required for Passport
app.use(session({
    secret: 'vidyapathaisalwaysrunning', // Change this to a more secure secret
    resave: true,
    saveUninitialized: true
}));/**/



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/**/

// Middleware to make `isAuthenticated` available in all views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user; // Optionally pass user info
    next();
});/**/

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl; // Save the original URL
    res.redirect('/login'); // Redirect to login if not authenticated
}

// Routes
require('./app/routes.js')(app, passport, isAuthenticated); // Load authentication routes and pass in passport and authentication middleware

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
