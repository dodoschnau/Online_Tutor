const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/pages/user-controllers')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', userControllers.register)

router.get('/', (req, res) => {
  res.redirect('teachers')
})

module.exports = router
