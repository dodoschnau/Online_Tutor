'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 表示每個 Teacher 屬於一個 User
      Teacher.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
      Teacher.hasMany(models.TeacherAvailability, {
        foreignKey: 'teacherId',
        as: 'availableTime'
      })
      Teacher.hasMany(models.Appointment, {
        foreignKey: 'teacherId',
        as: 'appointments'
      })
    }
  }
  Teacher.init({
    teachingStyle: DataTypes.STRING,
    videoLink: DataTypes.STRING,
    lessonDuration: DataTypes.INTEGER,
    lessonDescription: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
    underscored: true
  })
  return Teacher
}
