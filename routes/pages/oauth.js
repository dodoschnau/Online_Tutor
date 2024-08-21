const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/teachers',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router
