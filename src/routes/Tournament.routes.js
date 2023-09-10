const express = require('express')
const {
    getTournaments,
    createTournament,
} = require('../controllers/Tournament.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getTournaments)
router.get('/:id', verifyToken, getTournaments)
router.post('/', verifyToken, createTournament)

module.exports = router
