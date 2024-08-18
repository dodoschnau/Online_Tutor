const { User, Teacher, Review, Appointment } = require('../../models')
const { sequelize } = require('../../models')
const { fn, col, literal, Op } = require('sequelize')
const countries = require('world-countries')
const { localFileHandler } = require('../../helpers/file-helpers')
const { getAppointments } = require('../../helpers/appointments-helpers')

const userControllers = {
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id
      const paramsId = req.params.id
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (parseInt(paramsId, 10) !== userId) throw new Error('You are not authorized to view this profile.')

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
        // This is an ARRAY of OBJECTS, and each OBJECT has 'userId' and 'totalDuration'
        const allUsersDurations = await Appointment.findAll({
          attributes: [
            'userId',
            [fn('SUM', fn('TIMESTAMPDIFF', literal('MINUTE'), col('start_time'), col('end_time'))), 'totalMinutes']
          ],
          where: { status: 'finished' },
          group: ['userId'],
          order: [[sequelize.literal('totalMinutes'), 'DESC']],
          raw: true
        })

        // Transform minutes to hours and format to one decimal place
        const formattedDurations = allUsersDurations.map(user => ({
          userId: user.userId,
          totalDuration: (user.totalMinutes / 60).toFixed(1)
        }))

        const userDuration = formattedDurations.find(user => user.userId === userId)

        // Calculate the rank of the current user
        currentUserTotalDuration = userDuration ? userDuration.totalDuration : '0.0'
        currentUserRank = formattedDurations.findIndex(user => user.userId === userId) + 1
      }

      const viewName = isTeacher ? 'users/teacher-profile' : 'users/profile'

      return res.render(viewName, {
        user,
        pendingConfirmedAppointments,
        finishedAppointments,
        appointmentsWithReviews,
        currentUserTotalDuration,
        currentUserRank
      })
    } catch (error) {
      next(error)
    }
  },
  getApplyTeacher: (req, res) => {
    return res.render('users/apply-teacher')
  },
  postApplyTeacher: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { introduction, teachingStyle, lessonDescription, lessonDuration, videoLink } = req.body

      const existingTeacher = await Teacher.findOne({ where: { userId } })
      if (existingTeacher) throw new Error('You are already a teacher!')

      if (!introduction || !teachingStyle || !lessonDescription || !lessonDuration || !videoLink) throw new Error('Please fill in all the required fields.')

      // Create teacher
      const teacher = await Teacher.create({
        userId,
        introduction,
        teachingStyle,
        lessonDescription,
        lessonDuration,
        videoLink
      })
      if (!teacher) throw new Error('Failed to create teacher.')

      // Update user's isTeacher field
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not found.')
      user.isTeacher = true
      await user.save()

      return res.redirect(`/users/${userId}`)
    } catch (error) {
      next(error)
    }
  },
  getEditProfile: async (req, res, next) => {
    try {
      const userId = req.params.id
      const countryName = countries.map(country => country.name.common)
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (user.id !== req.user.id) throw new Error('You are not authorized to view this profile.')

      if (user.isTeacher) {
        return res.render('users/teacher-edit-profile', { user, countryName })
      } else {
        return res.render('users/user-edit-profile', { user, countryName })
      }
    } catch (error) {
      next(error)
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (user.id !== req.user.id) throw new Error('You are not authorized to view this profile.')

      const { name, nation, introduction, teachingStyle, lessonDescription, lessonDuration, videoLink } = req.body

      const { file } = req
      let avatar
      if (file) {
        avatar = await localFileHandler(file)
      } else {
        avatar = user.avatar
      }

      // Update user
      if (!name || !nation) throw new Error('Please fill in all the required fields.')

      const updatedUser = await User.update(
        { name, nation, introduction, avatar },
        { where: { id: userId } }
      )
      if (!updatedUser) throw new Error('Failed to update user profile.')

      // Update teacher
      if (user.isTeacher) {
        if (!teachingStyle || !lessonDescription || !lessonDuration || !videoLink) throw new Error('Please fill in all the required fields.')

        const updatedTeacher = await Teacher.update(
          { teachingStyle, lessonDescription, lessonDuration, videoLink },
          { where: { userId } }
        )
        if (!updatedTeacher) throw new Error('Failed to update teacher profile.')
      }

      req.flash('success', 'Your profile has been updated successfully.')
      return res.redirect(`/users/${userId}`)
    } catch (error) {
      next(error)
    }
  },
  getSchedule: async (req, res, next) => {
    try {
      const userId = req.user.id
      const paramsId = req.params.id
      const user = await User.findByPk(userId, {
        include:
          [{
            model: Teacher,
            as: 'teacher'
          }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('User not found.')
      if (parseInt(paramsId, 10) !== userId) throw new Error('You are not authorized to view this profile.')

      const isTeacher = user.isTeacher
      const where = isTeacher ? { teacherId: user.teacher.id } : { userId }
      const include = isTeacher
        ? [{ model: User, as: 'student', attributes: ['name'] },
            { model: Review, as: 'review', attributes: ['score', 'message'] }]
        : [{
            model: Teacher,
            as: 'teacher',
            include: [{ model: User, as: 'user', attributes: ['name'] }]
          },
          { model: Review, as: 'review', attributes: ['score', 'message'] }]

      const appointments = await getAppointments(where, include, [['date', 'ASC']])

      return res.render('users/schedule', { user, appointments })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userControllers
