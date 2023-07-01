const express = require('express')
const router = express.Router()
const { createSport, getSports, getSport, updateSport, deleteSport } = require('../controllers/Sport.controllers')
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getSports)
router.get('/:id', getSport)
router.post('/', verifyToken, createSport)
router.put('/:id', verifyToken, updateSport)
router.delete('/:id', verifyToken, deleteSport)

module.exports = router
