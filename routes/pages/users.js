const express = require('express')
const router = express.Router()

const userControllers = require('../../controllers/pages/user-controllers')
const upload = require('../../middlewares/multer')

router.get('/applyTeacher', userControllers.getApplyTeacher)
router.post('/applyTeacher', userControllers.postApplyTeacher)
router.get('/:id/edit', userControllers.getEditProfile)
router.get('/:id', userControllers.getProfile)
router.put('/:id', upload.single('avatar'), userControllers.editProfile)

module.exports = router
