'use strict'

const { User, Teacher, TeacherAvailability, Appointment } = require('../models')
const { generateSlots } = require('../helpers/availability-student-side-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.findAll({ attributes: ['id'], where: { isTeacher: false, isAdmin: false }, raw: true })

    const teachers = await Teacher.findAll({ attributes: ['id', 'lessonDuration'], raw: true })
    const appointments = []

    await generateAppointments(users, teachers, appointments, 'finished', 4)
    await generateAppointments(users, teachers, appointments, 'finished', 4, true)
    await generateAppointments(users, teachers, appointments, 'pending', 4, true)

    await queryInterface.bulkInsert('Appointments', appointments, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Appointments', null, {})
  }
}

async function generateAppointments (users, teachers, appointments, status, count, forTeacher = false) {
  for (const entity of (forTeacher ? teachers : users)) {
    let appointmentCount = 0
    while (appointmentCount < count) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)]

      const availabilities = await TeacherAvailability.findAll({
        attributes: ['date', 'startTime', 'endTime', 'teacherId'],
        where: { teacherId: forTeacher ? entity.id : randomTeacher.id },
        raw: true
      })

      // When some teachers have no availabilities, we can skip them
      if (!availabilities.length) continue

      const randomAvailability = availabilities[Math.floor(Math.random() * availabilities.length)]

      const slots = generateSlots(randomAvailability.startTime, randomAvailability.endTime, forTeacher ? entity.lessonDuration : randomTeacher.lessonDuration)
      const randomSlot = slots[Math.floor(Math.random() * slots.length)]
      const availableSlot = await findExistingAppointment(randomSlot, randomAvailability.date, forTeacher ? entity.id : randomTeacher.id)

      if (availableSlot) {
        appointments.push({
          date: randomAvailability.date,
          start_time: availableSlot.start,
          end_time: availableSlot.end,
          status,
          user_id: forTeacher ? randomUser.id : entity.id,
          teacher_id: forTeacher ? entity.id : randomTeacher.id,
          created_at: new Date(),
          updated_at: new Date()
        })
        appointmentCount++
      }
    }
  }
}

async function findExistingAppointment (slot, date, teacherId) {
  const existingAppointment = await Appointment.findOne({
    where: {
      date,
      start_time: slot.start,
      end_time: slot.end,
      teacher_id: teacherId
    }
  })
  return !existingAppointment ? slot : null
}
