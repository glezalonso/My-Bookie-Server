const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const BookieModel = require('../models/Bookies.model')

const register = async (req, res) => {
  const { fullName, username, email, password } = req.body

  try {
    const exitEmail = await BookieModel.findOne({ email })
    if (exitEmail) return res.status(501).json({ error: 'Email already exist' })

    const exitUsername = await BookieModel.findOne({ username })
    if (exitUsername) return res.status(501).json({ error: 'username already exist' })

    const passwordHash = await bcrypt.hash(password, 10)

    const registerBookie = new BookieModel({
      fullName,
      username,
      email,
      password: passwordHash
    })
    registerBookie.save()
    if (!registerBookie) return res.status(501).json({ error: 'There was an error' })
    const token = jwt.sign({ username: registerBookie.username }, process.env.SECURITY_BOOKIE, { expiresIn: '24h' })

    res.status(201).json({ username: registerBookie.username, token })
  } catch (error) {
    return res.status(501).json({ error: 'There was an error' })
  }
}

const loginBookie = async (req, res) => {
  const { username, password } = req.body
  try {
    const existBookie = await BookieModel.findOne({ username })
    if (!existBookie) return res.status(501).json({ error: 'Wrong Credentials' })

    const verifyPass = await bcrypt.compare(password, existBookie.password)
    if (!verifyPass) return res.status(501).json({ error: 'Wrong Credentials' })

    const token = jwt.sign({ username: existBookie.username }, process.env.SECURITY_BOOKIE, { expiresIn: '24h' })
    res.status(201).json({ username: existBookie.username, token })
  } catch (error) {
    return res.status(501).json({ error: 'There was an error' })
  }
}

module.exports = {
  loginBookie,
  register
}
