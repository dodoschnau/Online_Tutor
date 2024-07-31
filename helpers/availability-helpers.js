const { Op } = require('sequelize')
const { Teacher, TeacherAvailability } = require('../models')

const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

module.exports = {
  // Generate hours options for the dropdown
  generateHoursOptions: (length) => {
    return Array.from({ length }, (_, i) => i.toString().padStart(2, '0'))
  },

  // Format startTime and endTime to HH:mm:ss format
  formatTimes: (startHour, startMinute, endHour, endMinute) => {
    const startTime = dayjs(`${startHour}:${startMinute}`, 'HH:mm').format('HH:mm:ss')
    const endTime = dayjs(`${endHour}:${endMinute}`, 'HH:mm').format('HH:mm:ss')
    return { startTime, endTime }
  },

  // Check if the current session user is a teacher
  checkIfTeacher: async (userId) => {
    const teacher = await Teacher.findOne({
      where: { userId },
      raw: true
    })
    if (!teacher) throw new Error('You are not authorized to view this page.')
    return teacher
  },

  // Check if there is overlapping time
  checkOverlappingAvailability: async (teacherId, date, startTime, endTime) => {
    const overlappingAvailability = await TeacherAvailability.findOne({
      where: {
        teacherId,
        date,
        [Op.or]: [
          {
            [Op.and]: [
              // current startTime <= new startTime < current endTime
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gt]: startTime } }
            ]
          },
          {
            [Op.and]: [
              // current startTime < new endTime <= current endTime
              { startTime: { [Op.lt]: endTime } },
              { endTime: { [Op.gte]: endTime } }
            ]
          },
          {
            [Op.and]: [
              // new startTime <= current startTime && current endTime <= new endTime
              { startTime: { [Op.gte]: startTime } },
              { endTime: { [Op.lte]: endTime } }
            ]
          }
        ]
      }
    })

    if (overlappingAvailability) throw new Error('The time interval overlaps with existing availability, please choose another time.')
  }
}
