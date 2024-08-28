const express = require('express')
const router = express.Router()

const { localAuthenticate } = require('../../middlewares/api-auth')

const rootControllers = require('../../controllers/apis/root-controllers')

router.post('/login', localAuthenticate, rootControllers.login)

module.exports = router
