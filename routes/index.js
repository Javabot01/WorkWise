const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get("/", forwardAuthenticated, (req, res) => {
    res.render("welcome")
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user
    })
});
router.get("/courses", ensureAuthenticated, (req, res) => {
    res.render("courses/courses")
});
router.get("/enroll", ensureAuthenticated, (req, res) => {
    res.render("courses/enroll")
});
router.get("/contact", (req, res) => {
    res.render("contact")
});
router.get("/about", (req, res) => {
    res.render("about")
});
router.get("/blog", (req, res) => {
    res.render("blogs/blog")
});
router.get("/blog-single", (req, res) => {
    res.render("blogs/blog-single")
});

module.exports = router;