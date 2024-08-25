const express = require('express')
const router = express.Router()

const teachers = require('./teachers')

router.use('/teachers', teachers)

module.exports = router
