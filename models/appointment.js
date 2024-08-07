'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 表示每個 Appointment 屬於一個 User
      Appointment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'student'
      })
      // 表示每個 Appointment 屬於一個 Teacher
      Appointment.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher'
      })
    }
  }
  Appointment.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'Appointments',
    underscored: true
  })
  return Appointment
}
