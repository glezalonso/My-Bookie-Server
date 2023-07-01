const express = require('express')
const { getSeasons, getSeason, createSeason, updateSeason, deleteSeason } = require('../controllers/Season.controllers')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getSeasons)
router.get('/:id', getSeason)
router.post('/', verifyToken, createSeason)
router.put('/:id', verifyToken, updateSeason)
router.delete('/:id', verifyToken, deleteSeason)

module.exports = router
