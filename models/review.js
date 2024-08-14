'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Review.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
        as: 'appointment'
      })
    }
  }
  Review.init({
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    underscored: true
  })
  return Review
}
