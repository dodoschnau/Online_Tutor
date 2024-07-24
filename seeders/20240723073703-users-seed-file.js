'use strict'

const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('12345678', 10)

    const users = await Promise.all(
      Array.from({ length: 60 }, async (_, index) => ({
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: hash,
        avatar: faker.image.avatar(),
        nation: faker.location.country(),
        introduction: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    await queryInterface.bulkInsert('Users', users)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
