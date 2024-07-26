const passport = require('passport')
const LocalStrategy = require('passport-local')

const bcrypt = require('bcryptjs')

const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // pass request to verify callback
  },
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return done(null, false, { message: 'Email or password is incorrect!' })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return done(null, false, { message: 'Email or password is incorrect!' })

      return done(null, user)
    } catch (error) {
      return done(null, false, { message: 'Failed to login, please try again!' })
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    if (!user) return done(null, false, { message: 'User not found!' })

    return done(null, user.toJSON())
  } catch (error) {
    return done(null, false, { message: 'Failed to deserialize user!' })
  }
})

module.exports = passport
