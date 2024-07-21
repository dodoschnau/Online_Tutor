const express = require('express')
const { engine } = require('express-handlebars')

const app = express()
const port = process.env.PORT || 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
