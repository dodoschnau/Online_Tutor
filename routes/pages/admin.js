const express = require('express')
const router = express.Router()

const adminControllers = require('../../controllers/pages/admin-controllers')

router.get('/', adminControllers.getAdminDashboard)

module.exports = router
