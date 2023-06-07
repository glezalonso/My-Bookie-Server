const express = require('express')
const router = express.Router()
const { loginUser } = require('../controllers/User.controllers')

// path login, loginUser controller to validate login
router.post('/login', loginUser)
// path users/recovery to recovery email from opt code
router.get('/recovery')

module.exports = router
