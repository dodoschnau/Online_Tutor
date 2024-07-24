const { Op } = require('sequelize')
const { User, Teacher } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const teacherControllers = {
  getTeachers: async (req, res) => {
    const keyword = req.query.keyword?.trim().toLowerCase() || ''
    const DEFAULT_LIMIT = 6
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(page, limit)

    const where = keyword
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { nation: { [Op.like]: `%${keyword}%` } }
          ]
        }
      : {}

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{
        model: Teacher,
        as: 'teacher',
        required: true // 只返回有包含 Teacher 的 User
      }],
      offset,
      limit,
      raw: true,
      nest: true
    })

    const pagination = getPagination(count, page, limit)

    return res.render('teachers', {
      teachers: rows,
      pagination,
      keyword
    })
  }
}

module.exports = teacherControllers
