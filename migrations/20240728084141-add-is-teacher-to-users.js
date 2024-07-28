'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'is_teacher', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_teacher')
  }
}
