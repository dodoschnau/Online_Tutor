const express = require('express')
const router = express.Router()

const userControllers = require('../../controllers/pages/user-controllers')

router.get('/applyTeacher', userControllers.getApplyTeacher)
router.post('/applyTeacher', userControllers.postApplyTeacher)
router.get('/:id', userControllers.getProfile)

module.exports = router
