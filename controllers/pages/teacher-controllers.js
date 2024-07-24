const { Op } = require('sequelize')
const { User, Teacher } = require('../../models')

const teacherControllers = {
  getTeachers: async (req, res) => {
    const keyword = req.query.keyword?.trim().toLowerCase() || ''
    const where = keyword
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { nation: { [Op.like]: `%${keyword}%` } }
          ]
        }
      : {}

    const users = await User.findAll({
      where,
      include: [{
        model: Teacher,
        as: 'teacher',
        required: true // 只返回有包含 Teacher 的 User
      }],
      raw: true,
      nest: true
    })
    return res.render('teachers', { users })
  }
}

module.exports = teacherControllers
