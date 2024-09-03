const jwt = require('jsonwebtoken')

const rootService = require('../../services/root-service')

const rootControllers = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },
  register: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword, nation } = req.body

      if (!name || !email || !nation || !password) {
        const err = new Error('Please fill in all fields.')
        err.status = 400
        throw err
      }
      if (password !== confirmPassword) {
        const err = new Error('Passwords do not match.')
        err.status = 400
        throw err
      }

      const userData = await rootService.register(name, email, password, confirmPassword, nation)
      delete userData.password

      if (!userData) {
        const err = new Error('Failed to create user.')
        err.status = 500
        throw err
      }

      return res.json({ status: 'success', data: userData })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = rootControllers
