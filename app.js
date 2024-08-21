if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const methodOverride = require('method-override')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const { pages } = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const messageHandler = require('./middlewares/message-handler')
const { getUser } = require('./helpers/auth-helpers')

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarsHelpers
}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(messageHandler)
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

app.use(pages)

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
