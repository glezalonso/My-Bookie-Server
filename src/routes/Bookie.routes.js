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
    getTopMonth,
    getTopMonthSport,
    getBookiesPage,
    getBookieChampion,
    getBookieChampionRound,
} = require('../controllers/Bookie.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getBookies)
router.get('/:id', verifyToken, getBookie)
router.put('/top/', verifyToken, getBookieTop)
router.get('/picks/:id', verifyToken, getBookiePicks)
router.put('/:id', verifyToken, updateBookie)
router.delete('/:id', verifyToken, deleteBookie)
router.post('/follow/:id', verifyToken, addFollower)
router.put('/follow/:id', verifyToken, removeFollower)
router.put('/avatar/:id', verifyToken, addAvatar)
router.get('/topmonth/:date', verifyToken, getTopMonth)
router.get('/topmonthsport/:date/:sport', verifyToken, getTopMonthSport)
router.get('/page/:page', verifyToken, getBookiesPage)
router.get('/tournament/:season/:minimun', getBookieChampion)
router.get('/minitournament/:round/:minimun', getBookieChampionRound)

module.exports = router
