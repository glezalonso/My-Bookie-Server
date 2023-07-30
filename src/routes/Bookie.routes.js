const express = require('express')
const {
    getBookies,
    getBookie,
    updateBookie,
    deleteBookie,
    getBookiePicks,
    addFollower,
    removeFollower,
} = require('../controllers/Bookie.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getBookies)
router.get('/:id', verifyToken, getBookie)
router.get('/picks/:id', verifyToken, getBookiePicks)
router.put('/:id', verifyToken, updateBookie)
router.delete('/:id', verifyToken, deleteBookie)
router.put('/follow/:id', verifyToken, addFollower)
router.delete('/follow/:id', verifyToken, removeFollower)
module.exports = router
