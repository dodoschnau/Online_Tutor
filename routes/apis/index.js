const express = require('express')
const router = express.Router()

const teachers = require('./teachers')
const root = require('./root')

const { authenticated } = require('../../middlewares/api-auth')

const { apiErrorHandler } = require('../../middlewares/error-handler')

router.use('/teachers', authenticated, teachers)
router.use('/', root)

router.use('/', apiErrorHandler) // Error handler will be applied to all routes starting with /

module.exports = router
