const express = require('express')
const {
    getBookies,
    getBookie,
    updateBookie,
    deleteBookie,
    getBookiePicks,
} = require('../controllers/Bookie.controllers')
const { verifyToken } = require('../middlewares/verifyToken')
const router = express.Router()

router.get('/', verifyToken, getBookies)
router.get('/:id', verifyToken, getBookie)
router.get('/picks/:id', getBookiePicks)
router.put('/:id', verifyToken, updateBookie)
router.delete('/:id', verifyToken, deleteBookie)

module.exports = router
