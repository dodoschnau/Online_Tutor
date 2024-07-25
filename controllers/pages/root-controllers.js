const bcrypt = require('bcryptjs')
const { User } = require('../../models')

const rootControllers = {
  loginPage: async (req, res) => {
    res.render('login')
  },
  registerPage: async (req, res) => {
    res.render('register')
  },
  register: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword, nation } = req.body

      if (!name || !email || !nation) throw new Error('Please fill in all fields.')
      if (password !== confirmPassword) throw new Error('Passwords do not match.')

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) throw new Error('Email already exists.')

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({ name, email, password: hashedPassword, nation })
      if (!user) throw new Error('Failed to create user.')
      req.flash('success', 'Account created successfully.')
      return res.redirect('/login')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = rootControllers
