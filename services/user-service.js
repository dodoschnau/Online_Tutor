const { User, Teacher, Review } = require('../models')
const { Op } = require('sequelize')
const { getAppointments } = require('../helpers/appointments-helpers')
const { getUsersSumDurations } = require('../helpers/sum-duration-helper')
const { getAverageScore } = require('../helpers/average-score-helper')

const userService = {
  getProfile: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include:
            [{
              model: Teacher,
              as: 'teacher'
            }],
      raw: true,
      nest: true
    })
    if (!user) {
      const err = new Error('User not found.')
      err.status = 404
      throw err
    }

    const isTeacher = user.isTeacher
    const where = isTeacher ? { teacherId: user.teacher.id } : { userId }
    const include = isTeacher
      ? [
          { model: User, as: 'student', attributes: ['name', 'avatar'] },
          { model: Review, as: 'review', attributes: ['score', 'message'] }
        ]
      : [
          {
            model: Teacher,
            as: 'teacher',
            include: [{ model: User, as: 'user', attributes: ['name', 'avatar'] }]
          },
          { model: Review, as: 'review', attributes: ['score'] }
        ]

    const [pendingConfirmedAppointments, finishedAppointments, appointmentsWithReviews] = await Promise.all([
      getAppointments({ ...where, status: ['pending', 'confirmed'] }, include, [['createdAt', 'DESC']], 4),
      getAppointments({ ...where, status: 'finished' }, include, [['updatedAt', 'DESC']], 4),
      // For teacher's recent reviews
      getAppointments({
        ...where,
        status: 'finished',
        // make sure the review is not null
        '$review.id$': { [Op.ne]: null }
      }, include, [['updatedAt', 'DESC']], 4)
    ])

    let currentUserTotalDuration = null
    let currentUserRank = null

    if (!user.isTeacher) {
      const allUsersSumDurations = await getUsersSumDurations()
      const userDuration = allUsersSumDurations.find(user => user.userId === userId)

      // Calculate the rank of the current user
      currentUserTotalDuration = userDuration ? userDuration.totalHours : '0.0'
      currentUserRank = userDuration ? userDuration.rank : null
    }

    let averageScore = null
    if (user.isTeacher) {
      // Get the average score of the teacher's reviews
      averageScore = await getAverageScore(user.teacher.id)
    }

    return {
      user,
      pendingConfirmedAppointments,
      finishedAppointments,
      appointmentsWithReviews,
      currentUserTotalDuration,
      currentUserRank,
      averageScore
    }
  }
}

module.exports = userService
