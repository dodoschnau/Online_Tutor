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
      if (user.teacher && user.teacher.id) {
        return res.render('users/teacher-profile', { user })
      } else {
        return res.render('users/profile', { user })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userControllers
