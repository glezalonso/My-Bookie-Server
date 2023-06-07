//  import express to use  router
const express = require('express')
const router = express.Router()
const { createLeague, getLeagues, getLeague, updateLeague, deleteLeague } = require('../controllers/League.controllers')

// create routes for league with method
router.post('/', createLeague)
router.get('/', getLeagues)
router.get('/:id', getLeague)
router.put('/:id', updateLeague)
router.delete('/:id', deleteLeague)

module.exports = router
