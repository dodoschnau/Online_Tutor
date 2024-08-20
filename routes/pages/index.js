const express = require('express')
const router = express.Router()

const root = require('./root')
const teachers = require('./teachers')
const users = require('./users')
const availabilities = require('./availabilities')
const admin = require('./admin')

const { generalErrorHandler } = require('../../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middlewares/auth')

router.use('/availabilities', authenticated, availabilities)
router.use('/teachers', authenticated, teachers)
router.use('/users', authenticated, users)
router.use('/admin', authenticatedAdmin, admin)
router.use('/', root)

router.use('/', generalErrorHandler) // 錯誤處理會作用在所有 / 開頭的路徑

module.exports = router
