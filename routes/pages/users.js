const express = require('express')
const router = express.Router()

const userControllers = require('../../controllers/pages/user-controllers')
const appointmentControllers = require('../../controllers/pages/appointment-controllers')
const reviewControllers = require('../../controllers/pages/review-controllers')
const upload = require('../../middlewares/multer')

router.post('/review', reviewControllers.postReview)

router.delete('/appointment/:id', appointmentControllers.deleteAppointment)
router.put('/appointment/:id', appointmentControllers.putAppointmentStatus)
router.post('/appointment', appointmentControllers.postAppointment)

router.get('/applyTeacher', userControllers.getApplyTeacher)
router.post('/applyTeacher', userControllers.postApplyTeacher)

router.get('/:id/schedule', userControllers.getSchedule)
router.get('/:id/edit', userControllers.getEditProfile)
router.get('/:id', userControllers.getProfile)
router.put('/:id', upload.single('avatar'), userControllers.editProfile)

module.exports = router
