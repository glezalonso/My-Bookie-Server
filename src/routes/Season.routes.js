const express = require('express')
const { getSeasons, getSeason, createSeason, updateSeason, deleteSeason, addTeam, removeTeam } = require('../controllers/Season.controllers')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getSeasons)
router.get('/:id', getSeason)
router.post('/', verifyToken, createSeason)
router.put('/:id', verifyToken, updateSeason)
router.delete('/:id', verifyToken, deleteSeason)
router.put('/addteam/:id', verifyToken, addTeam)
router.delete('/removeteam/:id', verifyToken, removeTeam)

module.exports = router
