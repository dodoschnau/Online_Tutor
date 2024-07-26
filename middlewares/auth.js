const { ensureAuthenticated } = require('../helpers/auth-helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (ensureAuthenticated(req)) {
      return next()
    }
    req.flash('error', 'Please login first.')
    return res.redirect('/login')
  }
}
