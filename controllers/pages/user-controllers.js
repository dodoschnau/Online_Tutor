const userControllers = {
  loginPage: async (req, res) => {
    res.render('login')
  },
  registerPage: async (req, res) => {
    res.render('register')
  }
}

module.exports = userControllers
