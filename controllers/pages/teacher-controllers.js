const { Op } = require('sequelize')
const { User, Teacher, TeacherAvailability, Appointment } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const { processAvailabilities } = require('../../helpers/availability-student-side-helpers')
const { getUsersSumDurations } = require('../../helpers/sum-duration-helper')

const teacherControllers = {
  getTeachers: async (req, res, next) => {
    try {
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

      const [{ count, rows }, formattedTopStudents] = await Promise.all([
        User.findAndCountAll({
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
        }),
        getUsersSumDurations(10, true)
      ])

      const pagination = getPagination(count, page, limit)

      return res.render('teachers', {
        teachers: rows,
        pagination,
        keyword,
        formattedTopStudents
      })
    } catch (error) {
      next(error)
    }
  },
  getTeacher: async (req, res, next) => {
    try {
      const { id } = req.params
      const [appointmentData] = req.flash('appointment')
      const teacher = await Teacher.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'nation', 'avatar', 'introduction']
          },
          {
            model: TeacherAvailability,
            as: 'availableTime'
          }
        ]
      })
      if (!teacher) throw new Error('Cannot find teacher.')

      const availabilities = teacher.toJSON().availableTime.map(slot => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))

      const lessonDuration = teacher.toJSON().lessonDuration

      const appointments = await Appointment.findAll({
        where: { teacherId: id },
        attributes: ['date', 'startTime', 'endTime'],
        raw: true
      })

      const { processedAvailability, hasAvailableSlots } = processAvailabilities(availabilities, lessonDuration, appointments)

      return res.render('teacher', {
        teacher: teacher.toJSON(),
        processedAvailabilities: processedAvailability,
        appointment: appointmentData,
        hasAvailableSlots
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = teacherControllers
