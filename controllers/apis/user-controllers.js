const userService = require('../../services/user-service')

const userControllers = {
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id
      const paramsId = req.params.id

      if (parseInt(paramsId, 10) !== userId) {
        const err = new Error('You are not authorized to view this profile.')
        err.status = 403
        throw err
      }

      const profileData = await userService.getProfile(userId)

      return res.json({ status: 'success', data: profileData })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userControllers
