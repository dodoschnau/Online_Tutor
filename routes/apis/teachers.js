const express = require('express')
const router = express.Router()

const teacherControllers = require('../../controllers/apis/teacher-controllers')

router.get('/:id', teacherControllers.getTeacher)
router.get('/', teacherControllers.getTeachers)

module.exports = router
