const express = require('express')
const { getTeams, getTeam, createTeam, addPlayer, removePlayer, deleteTeam, updateTeam } = require('../controllers/Team.controllers')
const router = express.Router()

router.get('/', getTeams)
router.get('/:id', getTeam)
router.post('/', createTeam)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)
router.post('/addplayer/:id', addPlayer)
router.delete('/removeplayer/:id', removePlayer)

module.exports = router
