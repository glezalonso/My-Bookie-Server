const express = require('express')
const { getSeasons, getSeason, createSeason, updateSeason, deleteSeason } = require('../controllers/Season.controllers')
const router = express.Router()

router.get('/', getSeasons)
router.get('/:id', getSeason)
router.post('/', createSeason)
router.put('/:id', updateSeason)
router.delete('/:id', deleteSeason)

module.exports = router
