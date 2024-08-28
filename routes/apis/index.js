const express = require('express')
const router = express.Router()

const teachers = require('./teachers')
const root = require('./root')

const { apiErrorHandler } = require('../../middlewares/error-handler')

router.use('/teachers', teachers)
router.use('/', root)

router.use('/', apiErrorHandler) // Error handler will be applied to all routes starting with /

module.exports = router
