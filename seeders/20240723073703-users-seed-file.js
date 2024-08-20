'use strict'

const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('12345678', 10)

    const admin = {
      name: 'admin',
      email: 'root@example.com',
      password: hash,
      nation: 'Taiwan',
      is_teacher: false,
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }

    const users = await Promise.all(
      Array.from({ length: 60 }, async (_, index) => ({
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: hash,
        avatar: faker.image.avatar(),
        nation: faker.location.country(),
        introduction: faker.lorem.sentence(),
        is_teacher: index < 30, // 只有前30個使用者是老師
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )

    users.push(admin)

    await queryInterface.bulkInsert('Users', users)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
