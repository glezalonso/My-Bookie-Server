const express = require('express')
const router = express.Router()
const { getUsers, getUser, registerUser, updateUser, deleteUser } = require('../controllers/User.controllers')
const { verifyToken } = require('../middlewares/verifyToken')

// path users/login, registerUser controller to register in database
router.post('/register', verifyToken, registerUser)
// path users/register, getUsers controlller to get all users
router.get('/', verifyToken, getUsers)
//  path users and id param, getUser controller to get one user
router.get('/:id', verifyToken, getUser)
// path user, id param and method put. updateUser controller to update data of user
router.put('/:id', verifyToken, updateUser)
// path delete, id param and method delete. deleteUser controller to delete one user only
router.delete('/:id', verifyToken, deleteUser)

module.exports = router
