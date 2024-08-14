const { Appointment } = require('../models')

const getAppointments = async (where, include, order = [['createdAt', 'DESC']], limit = null) => {
  return Appointment.findAll({
    where,
    include,
    order,
    limit,
    nest: true,
    raw: true
  })
}

module.exports = {
  getAppointments
}
