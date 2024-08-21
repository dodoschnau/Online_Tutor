const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const bcrypt = require('bcryptjs')

const { User } = require('../models')

// Local Strategy
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

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const { id, displayName, emails, photos } = profile
    const email = emails[0].value
    const avatar = photos[0].value

    let user = await User.findOne({ where: { email } })
    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        avatar,
        nation: 'Taiwan',
        password: await bcrypt.hash(id, 10),
        isAdmin: false,
        isTeacher: false
      })
    }
    return cb(null, user)
  } catch (error) {
    return cb(error, null)
  }
}
))

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
