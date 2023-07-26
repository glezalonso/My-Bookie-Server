const express = require('express')
const {
    getPlayers,
    getPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerBySport,
    getPlayersTeamless,
} = require('../controllers/Player.controllers')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getPlayers)
router.get('/:id', getPlayer)
router.post('/', verifyToken, createPlayer)
router.put('/:id', verifyToken, updatePlayer)
router.delete('/:id', verifyToken, deletePlayer)
router.post('/playersbysport', getPlayerBySport)
router.post('/playersteamless', getPlayersTeamless)

module.exports = router
