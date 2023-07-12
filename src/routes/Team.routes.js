const express = require('express')
const { getTeams, getTeam, createTeam, addPlayer, removePlayer, deleteTeam, updateTeam, getTeamBySport } = require('../controllers/Team.controllers')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getTeams)
router.get('/:id', getTeam)
router.post('/', verifyToken, createTeam)
router.put('/:id', verifyToken, updateTeam)
router.delete('/:id', verifyToken, deleteTeam)
router.post('/addplayer/:id', verifyToken, addPlayer)
router.delete('/removeplayer/:id', verifyToken, removePlayer)
router.post('/teamsbysport', getTeamBySport)

module.exports = router
