const { User, Teacher } = require('../../models')

const teacherControllers = {
  getTeachers: async (req, res) => {
    const users = await User.findAll({
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
