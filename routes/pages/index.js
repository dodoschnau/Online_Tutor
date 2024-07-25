const express = require('express')
const router = express.Router()

const root = require('./root')
const teachers = require('./teachers')

const { generalErrorHandler } = require('../../middlewares/error-handler')

router.use('/teachers', teachers)
router.use('/', root)

router.use('/', generalErrorHandler) // 錯誤處理會作用在所有 / 開頭的路徑

module.exports = router
