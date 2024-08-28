const passport = require('../config/passport')

module.exports = {
  // using passport's JWT strategy for authentication, without using session
  authenticate: passport.authenticate('jwt', { session: false }),

  // check if the account is admin
  authenticatedAdmin: async (req, res, next) => {
    if (req.user && req.user.isAdmin) return next()
    return res.status(403).json({ message: 'You are not authorized to access this page.' })
  },

  // using passport's LOCAL strategy for authentication, without using session
  localAuthenticate: (req, res, next) => {
    if (!req.body.email || !req.body.password) return res.status(400).json({ message: 'Please fill in all the fields.' })

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ message: 'Invalid email or password.' })

      // if "user" is authenticated, add "req.user"
      req.user = user
      next()
    })(req, res, next)
  }
}
