const express = require("express");
const expLay = require("express-ejs-layouts");
const path = require("path");
const fs = require('fs');
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

// EJS
app.use(expLay);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// BodyParser 
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use("/", require("./routes/index.js"));
app.use("/", require("./routes/users.js"));


// process.send({ event: 'online' });
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    const file = fs.readFileSync('client/index.html', 'utf8');
    const newFile = file.replace('"{process.env.BROWSER_REFRESH_URL}"', process.env.BROWSER_REFRESH_URL);
    res.send(newFile);
})
const Port = 1000;

app.listen(Port, console.log(" Server Connected"));