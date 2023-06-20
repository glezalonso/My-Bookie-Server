const express = require('express')
const router = express.Router()
const { loginUser } = require('../controllers/User.controllers')
const { generateOTP, verifyOTP, resetPassword } = require('../controllers/Reset.controllers')

// path login, loginUser controller to validate login
router.post('/login', loginUser)
// path generateOTP recovery email from opt code
router.post('/generateOTP', generateOTP)
// path  verifyOTP verifyOPT
router.post('/verifyOTP', verifyOTP)
// path resetPassword
router.put('/resetPassword', resetPassword)

module.exports = router
