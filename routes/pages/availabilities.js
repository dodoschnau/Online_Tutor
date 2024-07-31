const express = require('express')
const router = express.Router()

const availabilityControllers = require('../../controllers/pages/availability-controllers')

router.get('/', availabilityControllers.getAvailabilities)
router.post('/', availabilityControllers.postAvailability)
router.delete('/:id', availabilityControllers.deleteAvailability)

module.exports = router
