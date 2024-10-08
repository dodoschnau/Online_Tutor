const { User, Teacher, TeacherAvailability, Appointment, Review } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const { processAvailabilities } = require('../../helpers/availability-student-side-helpers')
const teacherService = require('../../services/teacher-service')
const { getAverageScore } = require('../../helpers/average-score-helper')

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

      return res.render('teachers', {
        teachers,
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
      if (!teacher) throw new Error('Cannot find teacher.')

      let averageScore = null
      averageScore = await getAverageScore(id)

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
        hasAvailableSlots,
        averageScore
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = teacherControllers
