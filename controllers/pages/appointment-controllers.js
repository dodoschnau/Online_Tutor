const { User, Teacher, Appointment } = require('../../models')
const dayjs = require('dayjs')

const appointmentControllers = {
  postAppointment: async (req, res, next) => {
    try {
      const user = req.user
      const userId = req.user.id
      const { teacherId, selectedTime } = req.body

      if (user.isTeacher) throw new Error('Teacher cannot make appointments.')

      const teacher = await Teacher.findByPk(teacherId, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }],
        raw: true,
        nest: true
      })
      if (!teacher) throw new Error('Cannot find this teacher.')

      // Filter out empty times
      const validSelections = Object.entries(selectedTime).filter(([_, time]) => time !== '')

      // If User didn't select any time
      if (validSelections.length === 0) throw new Error('Please select at least one time.')

      // Check if there is only one valid selection
      if (validSelections.length !== 1) throw new Error('Please select only one time.')

      // Convert to date and time format
      const [dateString, timeRange] = validSelections[0]
      const [startTimeString, endTimeString] = timeRange.split(' - ')
      const date = dayjs(dateString).format('YYYY-MM-DD')
      const startTime = dayjs(`2000-01-01 ${startTimeString}`).format('HH:mm:ss')
      const endTime = dayjs(`2000-01-01 ${endTimeString}`).format('HH:mm:ss')

      // Check if the time slot is already booked
      const existingAppointment = await Appointment.findOne({
        where: {
          date,
          startTime,
          endTime
        }
      })
      if (existingAppointment) throw new Error('This time slot has already been booked.')

      const appointment = await Appointment.create({
        date,
        startTime,
        endTime,
        userId,
        teacherId
      })
      if (!appointment) throw new Error('Failed to create appointment!')

      req.flash('success', 'Successfully created appointment!')
      req.flash('appointment', appointment.toJSON())

      return res.redirect(`/teachers/${teacherId}`)
    } catch (error) {
      next(error)
    }
  },
  deleteAppointment: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = req.user
      const appointment = await Appointment.findByPk(id)
      if (!appointment) throw new Error('Appointment not found.')

      const teacher = await Teacher.findByPk(appointment.teacherId)
      if (!teacher) throw new Error('Teacher not found.')
      if (user.isTeacher) {
        if (appointment.teacherId !== teacher.id) throw new Error('You are not authorized to delete this appointment.')
      } else {
        if (appointment.userId !== user.id) throw new Error('You are not authorized to delete this appointment.')
      }

      await Appointment.destroy({ where: { id } })
      req.flash('success', 'Appointment deleted successfully.')
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  confirmAppointment: async (req, res, next) => {
    try {
      const id = req.params.id
      const appointment = await Appointment.findByPk(id)
      if (!appointment) throw new Error('Appointment not found.')

      const teacher = await Teacher.findByPk(appointment.teacherId)
      if (!teacher) throw new Error('Teacher not found.')

      if (appointment.teacherId !== teacher.id) throw new Error('You are not authorized to confirm this appointment.')

      await Appointment.update({ status: 'confirmed' }, { where: { id } })
      req.flash('success', 'Appointment confirmed successfully.')
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = appointmentControllers
