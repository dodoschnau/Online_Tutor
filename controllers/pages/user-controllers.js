const { User, Teacher } = require('../../models')

const userControllers = {
  getProfile: async (req, res, next) => {
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

      if (user.isTeacher) {
        return res.render('users/teacher-profile', { user })
      } else {
        return res.render('users/profile', { user })
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
  }
}

module.exports = userControllers
