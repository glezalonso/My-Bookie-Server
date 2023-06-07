const express = require('express')
const { createRound, getRounds, getRound, updateRound, deleteRound, addMatch, removeMatch } = require('../controllers/Round.controllers')
const router = express.Router()

router.get('/', getRounds)
router.get('/:id', getRound)
router.post('/', createRound)
router.put('/:id', updateRound)
router.delete('/:id', deleteRound)
router.post('/addmatch/:id', addMatch)
router.delete('/removematch/:id', removeMatch)

module.exports = router
