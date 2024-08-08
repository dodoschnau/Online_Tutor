const { User, Teacher, Appointment } = require('../../models')
const countries = require('world-countries')
const { localFileHandler } = require('../../helpers/file-helpers')

const userControllers = {
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id
      const paramsId = req.params.id
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (parseInt(paramsId, 10) !== userId) throw new Error('You are not authorized to view this profile.')

      if (user.isTeacher) {
        const appointments = await Appointment.findAll({
          where: { teacherId: user.teacher.id },
          include: [{
            model: User,
            as: 'student',
            attributes: ['name']
          }],
          order: [['createdAt', 'DESC']],
          limit: 4,
          raw: true,
          nest: true
        })
        return res.render('users/teacher-profile', { user, appointments })
      } else {
        const appointments = await Appointment.findAll({
          where: { userId },
          include: [{
            model: Teacher,
            as: 'teacher',
            include: [{ model: User, as: 'user', attributes: ['name'] }]
          }],
          order: [['createdAt', 'DESC']],
          limit: 4,
          raw: true,
          nest: true
        })
        return res.render('users/profile', { user, appointments })
      }
    } catch (error) {
      next(error)
    }
  },
  getApplyTeacher: (req, res) => {
    return res.render('users/apply-teacher')
  },
  postApplyTeacher: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { introduction, teachingStyle, lessonDescription, lessonDuration, videoLink } = req.body

      const existingTeacher = await Teacher.findOne({ where: { userId } })
      if (existingTeacher) throw new Error('You are already a teacher!')

      if (!introduction || !teachingStyle || !lessonDescription || !lessonDuration || !videoLink) throw new Error('Please fill in all the required fields.')

      // Create teacher
      const teacher = await Teacher.create({
        userId,
        introduction,
        teachingStyle,
        lessonDescription,
        lessonDuration,
        videoLink
      })
      if (!teacher) throw new Error('Failed to create teacher.')

      // Update user's isTeacher field
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not found.')
      user.isTeacher = true
      await user.save()

      return res.redirect(`/users/${userId}`)
    } catch (error) {
      next(error)
    }
  },
  getEditProfile: async (req, res, next) => {
    try {
      const userId = req.params.id
      const countryName = countries.map(country => country.name.common)
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (user.id !== req.user.id) throw new Error('You are not authorized to view this profile.')

      if (user.isTeacher) {
        return res.render('users/teacher-edit-profile', { user, countryName })
      } else {
        return res.render('users/user-edit-profile', { user, countryName })
      }
    } catch (error) {
      next(error)
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (user.id !== req.user.id) throw new Error('You are not authorized to view this profile.')

      const { name, nation, introduction, teachingStyle, lessonDescription, lessonDuration, videoLink } = req.body

      const { file } = req
      let avatar
      if (file) {
        avatar = await localFileHandler(file)
      } else {
        avatar = user.avatar
      }

      // Update user
      if (!name || !nation) throw new Error('Please fill in all the required fields.')

      const updatedUser = await User.update(
        { name, nation, introduction, avatar },
        { where: { id: userId } }
      )
      if (!updatedUser) throw new Error('Failed to update user profile.')

      // Update teacher
      if (user.isTeacher) {
        if (!teachingStyle || !lessonDescription || !lessonDuration || !videoLink) throw new Error('Please fill in all the required fields.')

        const updatedTeacher = await Teacher.update(
          { teachingStyle, lessonDescription, lessonDuration, videoLink },
          { where: { userId } }
        )
        if (!updatedTeacher) throw new Error('Failed to update teacher profile.')
      }

      req.flash('success', 'Your profile has been updated successfully.')
      return res.redirect(`/users/${userId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userControllers
