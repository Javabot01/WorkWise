const express = require('express')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

router.get('/companies', forwardAuthenticated, (req, res) => {
  res.render('companies')
})
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', {
    user: req.user,
  })
})
router.get('/jobs', ensureAuthenticated, (req, res) => {
  res.render('jobs')
})
router.get('/projects', ensureAuthenticated, (req, res) => {
  res.render('project')
})
router.get('/company-profile', (req, res) => {
  res.render('company-profile')
})
router.get('/about', (req, res) => {
  res.render('about')
})
router.get('/user-profile', ensureAuthenticated, (req, res) => {
  res.render('user-profile')
})
router.get('/my-profile-feed', ensureAuthenticated, (req, res) => {
  res.render('my-profile-feed')
})

module.exports = router
