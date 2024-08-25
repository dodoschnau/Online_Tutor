const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const teacherService = require('../../services/teacher-service')

const teacherControllers = {
  getTeachers: async (req, res, next) => {
    try {
      const keyword = req.query.keyword?.trim().toLowerCase() || ''
      const DEFAULT_LIMIT = 6
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(page, limit)

      const { count, teachers, formattedTopStudents } = await teacherService.getTeachers(keyword, offset, limit)

      const pagination = getPagination(count, page, limit)

      const responseData = {
        teachers,
        pagination,
        keyword,
        formattedTopStudents
      }
      return res.json({ status: 'success', data: responseData })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = teacherControllers
