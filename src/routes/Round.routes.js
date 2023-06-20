const express = require('express')
const { createRound, getRounds, getRound, updateRound, deleteRound } = require('../controllers/Round.controllers')
const router = express.Router()

router.get('/', getRounds)
router.get('/:id', getRound)
router.post('/', createRound)
router.put('/:id', updateRound)
router.delete('/:id', deleteRound)

module.exports = router
