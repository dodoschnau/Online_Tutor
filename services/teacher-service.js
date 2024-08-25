const { Op } = require('sequelize')
const { User, Teacher } = require('../models')
const { getUsersSumDurations } = require('../helpers/sum-duration-helper')

const teacherService = {
  getTeachers: async (keyword, offset, limit) => {
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
      attributes: { exclude: ['password'] }, // Exclude password
      include: [{
        model: Teacher,
        as: 'teacher',
        required: true // Only return users with teacher
      }],
      offset,
      limit,
      raw: true,
      nest: true
    })

    const formattedTopStudents = await getUsersSumDurations(10, true)

    return ({
      count,
      teachers: rows,
      formattedTopStudents
    })
  }
}

module.exports = teacherService
