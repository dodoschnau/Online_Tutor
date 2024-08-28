const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const rootControllers = require('../../controllers/apis/root-controllers')

router.post('/login', passport.authenticate('local', { session: false }), rootControllers.login)

module.exports = router
