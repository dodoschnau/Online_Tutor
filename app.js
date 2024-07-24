const express = require('express')
const { engine } = require('express-handlebars')

const app = express()
const port = process.env.PORT || 3000

const { pages } = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarsHelpers
}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(pages)

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
