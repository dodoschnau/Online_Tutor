const express = require('express')
const router = express.Router()

const teachers = require('./teachers')

const { apiErrorHandler } = require('../../middlewares/error-handler')

router.use('/teachers', teachers)

router.use('/', apiErrorHandler) // Error handler will be applied to all routes starting with /

module.exports = router
