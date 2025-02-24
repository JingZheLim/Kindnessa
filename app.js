var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // FOR USING SESSION //
// require('./auth');



// if you create js files in your routes add them here and in app.use
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var managerRouter = require('./routes/manager');

/*******************************/
/************ mySQL ************/
/*******************************/
var mysql = require('mysql');
// create a 'pool' (group) of connections to be used for connecting with our SQL server
var dbConnectionPool = mysql.createPool({
    host: '127.0.0.1',
    database: 'kindnessa',
});

var app = express();

// middle ware for mysql
app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    next();
    // console.log("Connection established successfully!");
});

// Make the pool available to the app
app.pool = dbConnectionPool;

/*******************************/
/************ mySQL ************/
/*******************************/

/*******************************/
/************ AUTH  ************/
/*******************************/
// const passport = require('passport');

// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['email', 'profile'] }));

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });


/*******************************/
/********** SESSION ************/
/*******************************/
app.use(session({
    secret: 'a string of your choice',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).send('Logged out');
    });
});

// UNCOMMENT THIS FOR FINAL PRODUCT
// blocks anyone from directly accessing html files by typing into the search bar
// app.use(function (req, res, next) {
//     if (req.url.endsWith('.html')) {
//         res.sendStatus(403);
//     } else {
//         next();
//     }
// });



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// middleware to parse JSON bodies
app.use(express.json());

// when the server is started, it will go to public/general
app.use(express.static(path.join(__dirname, 'public/')));

// app.use is here
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);


module.exports = app;
