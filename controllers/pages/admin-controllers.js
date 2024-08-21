const { User } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const adminControllers = {
  getAdminDashboard: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(page, limit)

      const { count, rows } = await User.findAndCountAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'avatar', 'isTeacher', 'isAdmin'],
        offset,
        limit,
        raw: true
      })

      const pagination = getPagination(count, page, limit)

      return res.render('admin-dashboard', {
        users: rows,
        pagination
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminControllers
