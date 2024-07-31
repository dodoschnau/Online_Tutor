'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TeacherAvailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      TeacherAvailability.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'availableTeacher'
      })
    }
  }
  TeacherAvailability.init({
    date: DataTypes.DATEONLY,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TeacherAvailability',
    tableName: 'TeacherAvailabilities',
    underscored: true
  })
  return TeacherAvailability
}
