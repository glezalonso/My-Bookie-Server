const express = require('express')
const router = express.Router()
const { getUsers, getUser, registerUser, updateUser, deleteUser } = require('../controllers/User.controllers')

// path users/login, registerUser controller to register in database
router.post('/register', registerUser)
// path users/register, getUsers controlller to get all users
router.get('/', getUsers)
//  path users and id param, getUser controller to get one user
router.get('/:id', getUser)
// path user, id param and method put. updateUser controller to update data of user
router.put('/:id', updateUser)
// path delete, id param and method delete. deleteUser controller to delete one user only
router.delete('/:id', deleteUser)

module.exports = router
