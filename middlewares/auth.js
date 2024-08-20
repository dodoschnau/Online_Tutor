const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (ensureAuthenticated(req)) {
      const user = getUser(req)
      if (user && user.isAdmin) {
        req.flash('error', 'You cannot access this page.')
        return res.redirect('/admin')
      }
      return next()
    }
    req.flash('error', 'Please login first.')
    return res.redirect('/login')
  },
  authenticatedAdmin: (req, res, next) => {
    if (ensureAuthenticated(req)) {
      const user = getUser(req)
      if (user && user.isAdmin) return next()
      req.flash('error', 'You are not authorized to access this page.')
      return res.redirect('/teachers')
    }
    req.flash('error', 'Please login first.')
    return res.redirect('/login')
  }
}
