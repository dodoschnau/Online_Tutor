const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const { pages } = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const messageHandler = require('./middlewares/message-handler')

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarsHelpers
}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(messageHandler)

app.use(pages)

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
