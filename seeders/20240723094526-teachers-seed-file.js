'use strict'

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 從現有id只取出前10個使用者(升序)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users ORDER BY id ASC LIMIT 30',
      { type: Sequelize.QueryTypes.SELECT }
    )

    const teachersData = users.map(user => ({
      teaching_style: faker.lorem.sentence(),
      video_link: faker.internet.url(),
      lesson_duration: [60, 90][Math.floor(Math.random() * 2)], // 隨機產生60分鐘或90分鐘
      lesson_description: faker.lorem.paragraph(),
      user_id: user.id,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await queryInterface.bulkInsert('Teachers', teachersData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teachers', null, {})
  }
}
