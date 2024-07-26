const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { checkLoginField } = require('../../middlewares/field-checker')
const rootControllers = require('../../controllers/pages/root-controllers')

router.get('/login', rootControllers.loginPage)
router.get('/register', rootControllers.registerPage)

router.post('/register', rootControllers.register)
// Check login field first, then authenticate
router.post('/login', checkLoginField, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), rootControllers.login)

router.get('/', (req, res) => {
  res.redirect('teachers')
})

module.exports = router
