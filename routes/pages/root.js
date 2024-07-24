const express = require('express')
const router = express.Router()
const rootControllers = require('../../controllers/pages/root-controllers')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', rootControllers.register)

router.get('/', (req, res) => {
  res.redirect('teachers')
})

module.exports = router
