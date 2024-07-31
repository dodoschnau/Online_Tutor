const { TeacherAvailability } = require('../../models')
const { generateHoursOptions, formatTimes, checkIfTeacher, checkOverlappingAvailability } = require('../../helpers/availability-helpers')

const availabilityControllers = {
  getAvailabilities: async (req, res, next) => {
    try {
      // Check if the current session user is a teacher
      const userId = req.user.id
      const teacher = await checkIfTeacher(userId)
      // If user is a teacher
      const teacherId = teacher.id

      const availabilities = await TeacherAvailability.findAll({
        where: { teacherId },
        order: [['date', 'ASC'], ['startTime', 'ASC']],
        raw: true
      })

      const groupAvailability = availabilities.reduce((acc, cur) => {
        const date = cur.date
        // If the date is not in the accumulator, add a new array with the current date
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(cur)
        return acc
      }, {})

      const availability = Object.keys(groupAvailability).map(date => ({
        date,
        times: groupAvailability[date]
      }))

      // padStart(2, '0') => if the number is less than 2 digits, it will be padded with a 0 at the beginning
      const hoursOptions = generateHoursOptions(24)
      const minutesOptions = ['00', '30']

      return res.render('availability', {
        hoursOptions,
        minutesOptions,
        availability: availability || [],
        teacherId
      })
    } catch (error) {
      next(error)
    }
  },
  postAvailability: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { date, startHour, startMinute, endHour, endMinute } = req.body

      const teacher = await checkIfTeacher(userId)
      const teacherId = teacher.id

      if (!teacher) {
        throw new Error('You are not authorized to create this availability.')
      }

      const { startTime, endTime } = formatTimes(startHour, startMinute, endHour, endMinute)

      if (endTime <= startTime) {
        throw new Error('End time must be later than start time!')
      }

      // Check if there is overlapping time
      await checkOverlappingAvailability(teacherId, date, startTime, endTime)

      const availability = await TeacherAvailability.create({
        date,
        startTime,
        endTime,
        teacherId
      })
      if (!availability) throw new Error('Failed to create availability!')

      req.flash('success', 'Successfully created availability!')
      return res.redirect('/availabilities')
    } catch (error) {
      next(error)
    }
  },
  deleteAvailability: async (req, res, next) => {
    try {
      const userId = req.user.id
      const teacher = await checkIfTeacher(userId)
      const id = req.params.id

      if (!teacher) {
        throw new Error('You are not authorized to delete this availability.')
      }

      const availability = await TeacherAvailability.findByPk(id)
      if (!availability) throw new Error('Availability not found!')

      await availability.destroy()

      req.flash('success', 'Successfully deleted availability!')
      return res.redirect('/availabilities')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = availabilityControllers
