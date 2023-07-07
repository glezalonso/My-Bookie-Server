const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares/verifyToken')
const { getNews, getNew, createNew, updateNew, deleteNew } = require('../controllers/New.controller')

router.get('/', getNews)
router.get('/:id', getNew)
router.post('/', verifyToken, createNew)
router.put('/:id', verifyToken, updateNew)
router.delete('/:id', verifyToken, deleteNew)

module.exports = router
