const express = require('express')
const { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/Player.controllers')
const router = express.Router()

router.get('/', getPlayers)
router.get('/:id', getPlayer)
router.post('/', createPlayer)
router.put('/:id', updatePlayer)
router.delete('/:id', deletePlayer)

module.exports = router
