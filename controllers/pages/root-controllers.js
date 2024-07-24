const bcrypt = require('bcryptjs')
const { User } = require('../../models')

const rootControllers = {
  loginPage: async (req, res) => {
    res.render('login')
  },
  registerPage: async (req, res) => {
    res.render('register')
  },
  register: async (req, res) => {
    try {
      const { name, email, password, confirmPassword, nation } = req.body
      if (!name || !email || !nation) {
        return res.redirect('/register')
      }
      if (password !== confirmPassword) {
        return res.redirect('/register')
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({ name, email, password: hashedPassword, nation })
      return res.redirect('/login')
    } catch (error) {
      console.log(error)
      return res.redirect('/register')
    }
  }
}

module.exports = rootControllers
