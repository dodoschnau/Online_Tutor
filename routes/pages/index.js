const express = require('express')
const router = express.Router()

const root = require('./root')
const teachers = require('./teachers')

router.use('/teachers', teachers)
router.use('/', root)

module.exports = router
