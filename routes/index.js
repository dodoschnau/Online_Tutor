const express = require('express')
const router = express.Router()

const pages = require('./pages')
const apis = require('./apis')

router.use('/api', apis)
router.use(pages)

module.exports = router
