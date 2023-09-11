const express = require('express')
const {
    getTournaments,
    createTournament,
    updateTournament,
} = require('../controllers/Tournament.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getTournaments)
router.get('/:id', verifyToken, getTournaments)
router.post('/', verifyToken, createTournament)
router.put('/:id', verifyToken, updateTournament)

module.exports = router
