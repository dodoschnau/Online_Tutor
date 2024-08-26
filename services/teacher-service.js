const { Op } = require('sequelize')
const { User, Teacher, TeacherAvailability, Appointment, Review } = require('../models')
const { getUsersSumDurations } = require('../helpers/sum-duration-helper')
const { getAverageScore } = require('../helpers/average-score-helper')

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
  },
  getTeacher: async (teacherId) => {
    const teacher = await Teacher.findByPk(teacherId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'nation', 'avatar', 'introduction']
        },
        {
          model: TeacherAvailability,
          as: 'availableTime'
        },
        {
          model: Appointment,
          as: 'appointments',
          where: { status: 'finished' },
          attributes: ['id'],
          include: [{
            model: Review,
            as: 'review',
            attributes: ['score', 'message']
          }],
          limit: 5
        }
      ]
    })
    if (!teacher) {
      const err = new Error('Cannot find teacher.')
      err.status = 404
      throw err
    }

    let averageScore = null
    averageScore = await getAverageScore(teacherId)

    const appointments = await Appointment.findAll({
      where: { teacherId },
      attributes: ['date', 'startTime', 'endTime'],
      raw: true
    })

    return ({
      teacher,
      averageScore,
      appointments
    })
  }
}

module.exports = teacherService
