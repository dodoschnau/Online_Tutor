const express = require('express')
const router = express.Router()

const { authenticate } = require('../../middlewares/api-auth')

const teacherControllers = require('../../controllers/apis/teacher-controllers')

router.get('/:id', authenticate, teacherControllers.getTeacher)
router.get('/', authenticate, teacherControllers.getTeachers)

module.exports = router
