const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../config/auth');

router.get("/login", forwardAuthenticated, (req, res) => {
    res.render("auth/login")
})
router.get("/register", forwardAuthenticated, (req, res) => {
    res.render("auth/register")
})

// Handles 
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Verify Details
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('auth/register', {
            errors,
            name,
            email,
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'User already exists' });
                res.render('auth/register', {
                    errors,
                    name,
                    email,
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;