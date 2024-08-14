const { Appointment, Review } = require('../../models')

const reviewControllers = {
  postReview: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { appointmentId, score, message } = req.body

      const appointment = await Appointment.findByPk(appointmentId, { raw: true })
      if (!appointment) throw new Error('Appointment not found.')

      if (userId !== appointment.userId) throw new Error('You are not authorized to rate this appointment.')

      const existingReview = await Review.findOne({ where: { appointmentId } })
      if (existingReview) throw new Error('You have already rated this appointment.')

      const review = await Review.create({
        appointmentId,
        score,
        message
      })
      if (!review) throw new Error('Failed to create review!')

      req.flash('success', 'Successfully created review!')
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = reviewControllers
