'use strict'

const { Teacher, Appointment } = require('../models')
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const teachers = await Teacher.findAll({ attributes: ['id'], raw: true })

    // appointments will be a Promise Array
    const appointments = teachers.map(teacher => Appointment.findAll({
      attributes: ['id'],
      where: {
        status: 'finished',
        teacherId: teacher.id
      },
      limit: 2,
      raw: true
    })
    )

    // flatten the Promise Array
    const allFinishedAppointments = (await Promise.all(appointments)).flat()

    const reviews = allFinishedAppointments.map(appointment => ({
      message: faker.lorem.sentence(),
      score: parseFloat((Math.random() * 4 + 1).toFixed(1)), // Generate a random score between 1.0 and 5.0
      appointment_id: appointment.id,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await queryInterface.bulkInsert('Reviews', reviews, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {})
  }
}
