const { User } = require('../models')

const bcrypt = require('bcryptjs')

const rootService = {
  register: async (name, email, password, confirmPassword, nation) => {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      const err = new Error('Email already exists.')
      err.status = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = await User.create({ name, email, password: hashedPassword, nation })

    return userData.toJSON()
  }
}

module.exports = rootService
