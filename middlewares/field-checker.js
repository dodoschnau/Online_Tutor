module.exports = {
  checkLoginField: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('error', 'Please fill in all fields.')
      return res.redirect('login')
    }
    next()
  }
}
