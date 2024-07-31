'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('TeacherAvailability', 'TeacherAvailabilities')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('TeacherAvailabilities', 'TeacherAvailability')
  }
}

// 之前的 tableName是 TeacherAvailability
