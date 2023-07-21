//  import express to use  router
const express = require('express')
const router = express.Router()
const {
    createLeague,
    getLeagues,
    getLeague,
    updateLeague,
    deleteLeague,
    getLeaguesBySport,
} = require('../controllers/League.controllers')
const { verifyToken } = require('../middlewares/verifyToken')

// create routes for league with method

router.get('/', getLeagues)
router.get('/:id', getLeague)
router.post('/leaguesbysport', getLeaguesBySport)
router.post('/', verifyToken, createLeague)
router.put('/:id', verifyToken, updateLeague)
router.delete('/:id', verifyToken, deleteLeague)

module.exports = router
