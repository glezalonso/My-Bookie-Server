const express = require('express')
const {
    getTournaments,
    createTournament,
    updateTournament,
    getTournamentsStatus,
    getTournament,
} = require('../controllers/Tournament.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getTournaments)
router.get('/:id', verifyToken, getTournament)
router.post('/', verifyToken, createTournament)
router.put('/:id', verifyToken, updateTournament)
router.get('/tournamentsstatus/:status', verifyToken, getTournamentsStatus)

module.exports = router
