const express = require('express')
const {
    getBookies,
    getBookie,
    updateBookie,
    deleteBookie,
    getBookiePicks,
    addFollower,
    removeFollower,
    addAvatar,
    getBookieTop,
} = require('../controllers/Bookie.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getBookies)
router.get('/:id', verifyToken, getBookie)
router.get('/top/:limit', verifyToken, getBookieTop)
router.get('/picks/:id', verifyToken, getBookiePicks)
router.put('/:id', verifyToken, updateBookie)
router.delete('/:id', verifyToken, deleteBookie)
router.post('/follow/:id', verifyToken, addFollower)
router.put('/follow/:id', verifyToken, removeFollower)
router.put('/avatar/:id', verifyToken, addAvatar)

module.exports = router
