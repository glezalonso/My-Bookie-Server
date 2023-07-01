const express = require('express')
const { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/Player.controllers')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getPlayers)
router.get('/:id', getPlayer)
router.post('/', verifyToken, createPlayer)
router.put('/:id', verifyToken, updatePlayer)
router.delete('/:id', verifyToken, deletePlayer)

module.exports = router
