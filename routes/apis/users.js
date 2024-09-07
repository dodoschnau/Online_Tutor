const express = require('express')
const router = express.Router()

const userControllers = require('../../controllers/apis/user-controllers')

router.get('/:id', userControllers.getProfile)

module.exports = router
