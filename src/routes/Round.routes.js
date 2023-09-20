const express = require('express')
const {
    createRound,
    getRounds,
    getRound,
    updateRound,
    deleteRound,
    getRoundsBySeason,
    getRoundsTour,
} = require('../controllers/Round.controllers')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getRounds)
router.get('/:id', getRound)
router.get('/tournament/:season', getRoundsTour)
// Round by season
router.get('/season/:season', getRoundsBySeason)
router.post('/', verifyToken, createRound)
router.put('/:id', verifyToken, updateRound)
router.delete('/:id', verifyToken, deleteRound)

module.exports = router
