const express = require('express')
const router = express.Router()

const teacherControllers = require('../../controllers/pages/teacher-controllers')

router.get('/', teacherControllers.getTeachers)

module.exports = router
