const express = require('express')
const router = express.Router()
const { createSport, getSports, getSport, updateSport, deleteSport } = require('../controllers/Sport.controllers')

router.get('/', getSports)
router.get('/:id', getSport)
router.post('/', createSport)
router.put('/:id', updateSport)
router.delete('/:id', deleteSport)

module.exports = router
