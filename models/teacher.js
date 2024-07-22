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
        foreignKey: 'user_id',
        as: 'user'
      })
    }
  }
  Teacher.init({
    teaching_style: DataTypes.STRING,
    vedio_link: DataTypes.STRING,
    lesson_duration: DataTypes.INTEGER,
    lesson_description: DataTypes.TEXT,
    user_id: {
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
