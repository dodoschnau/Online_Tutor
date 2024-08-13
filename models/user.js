'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 表示每個 User 可以有一個關聯的 Teacher
      User.hasOne(models.Teacher, {
        foreignKey: 'userId',
        as: 'teacher'
      })
      // 表示每個 User 可以有很多個 Appointment
      User.hasMany(models.Appointment, {
        foreignKey: 'userId',
        as: 'appointments'
      })
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        as: 'reviews'
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING
    },
    nation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    introduction: {
      type: DataTypes.STRING
    },
    isTeacher: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
