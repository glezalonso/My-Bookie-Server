const express = require('express')
const router = express.Router()
const { createLeague, getLeagues, getLeague, updateLeague, deleteLeague } = require('../controllers/League.controllers')

router.post('/', createLeague)
router.get('/', getLeagues)
router.get('/:id', getLeague)
router.put('/:id', updateLeague)
router.delete('/:id', deleteLeague)

module.exports = router
