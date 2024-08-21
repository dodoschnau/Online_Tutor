'use strict'

const { Teacher } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    const teachers = await Teacher.findAll({ raw: true })
    const availabilities = []

    const now = new Date()

    for (let i = 0; i < 14; i++) { // next two weeks
      const date = new Date(now)
      date.setDate(now.getDate() + i) // set date to next day

      teachers.forEach(teacher => {
        availabilities.push({
          date: date.toISOString().split('T')[0], // date format YYYY-MM-DD
          start_time: '18:00',
          end_time: '21:00',
          teacher_id: teacher.id,
          created_at: new Date(),
          updated_at: new Date()
        })
      })
    }

    await queryInterface.bulkInsert('TeacherAvailabilities', availabilities, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TeacherAvailabilities', null, {})
  }
}
