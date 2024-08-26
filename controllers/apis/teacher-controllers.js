const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const { processAvailabilities } = require('../../helpers/availability-student-side-helpers')

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

      if (page > pagination.totalPages || page < 1 || limit < 1) {
        const err = new Error('Invalid page or limit value')
        err.status = 400
        throw err
      }

      if (!teachers.length) {
        const err = new Error('No teachers found')
        err.status = 404
        throw err
      }

      if (!formattedTopStudents.length) {
        const err = new Error('No top students found')
        err.status = 404
        throw err
      }

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
  },
  getTeacher: async (req, res, next) => {
    try {
      const { id } = req.params
      const [appointmentData] = req.flash('appointment')

      const { teacher, averageScore, appointments } = await teacherService.getTeacher(id)

      const availabilities = teacher.toJSON().availableTime.map(slot => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))

      const lessonDuration = teacher.toJSON().lessonDuration

      const { processedAvailability, hasAvailableSlots } = processAvailabilities(availabilities, lessonDuration, appointments)

      const data = {
        teacher: teacher.toJSON(),
        processedAvailabilities: processedAvailability,
        appointment: appointmentData,
        hasAvailableSlots,
        averageScore
      }

      return res.json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = teacherControllers
