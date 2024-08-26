const { Review, Appointment } = require('../models')
const { fn, col } = require('sequelize')

module.exports = {
  getAverageScore: async (id) => {
    const teacherReviews = await Review.findAll({
      attributes: [
        [fn('AVG', col('score')), 'averageScore']
      ],
      include: [{
        model: Appointment,
        as: 'appointment',
        attributes: [],
        where: { teacherId: id }
      }],
      raw: true
    })

    const averageScore = teacherReviews[0].averageScore ? Number(teacherReviews[0].averageScore).toFixed(1) : null

    return averageScore
  }
}
