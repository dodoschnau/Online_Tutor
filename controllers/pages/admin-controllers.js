const { User } = require('../../models')

const adminControllers = {
  getAdminDashboard: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'avatar', 'isTeacher'],
        raw: true
      })

      return res.render('admin-dashboard', { users })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminControllers
