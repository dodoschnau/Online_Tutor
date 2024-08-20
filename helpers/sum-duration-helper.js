const { sequelize } = require('../models')
const { fn, col, literal } = require('sequelize')
const { User, Appointment } = require('../models')

const getUsersSumDurations = async (limit = null, includeUserDetails = false) => {
  const attributes = [
    'userId',
    [fn('SUM', fn('TIMESTAMPDIFF', literal('MINUTE'), col('start_time'), col('end_time'))), 'totalMinutes']
  ]
  const include = includeUserDetails
    ? [{
        model: User,
        as: 'student',
        attributes: ['name', 'avatar']
      }]
    : []

  const option = {
    attributes,
    include,
    where: { status: 'finished' },
    group: ['userId'],
    order: [[sequelize.literal('totalMinutes'), 'DESC']],
    nest: true,
    raw: true
  }

  if (limit) {
    option.limit = limit
  }

  const duration = await Appointment.findAll(option)

  return duration.map((item, index) => ({
    ...item,
    rank: index + 1,
    totalHours: (item.totalMinutes / 60).toFixed(1)
  }))
}

module.exports = {
  getUsersSumDurations
}
