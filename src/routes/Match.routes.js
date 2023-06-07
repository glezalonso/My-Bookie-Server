const express = require('express')
const router = express.Router()
const { getMatches, getMatch, createMatch, updateMatch, deleteMatch, addLineUp, removeLineUp, closeMatch } = require('../controllers/Match.controllers')

router.get('/', getMatches)

router.get('/:id', getMatch)

router.post('/', createMatch)

router.put('/:id', updateMatch)

router.delete('/:id', deleteMatch)

router.post('/addlineup/:id', addLineUp)

router.delete('/removelineup/:id', removeLineUp)

router.put('/closematch/:id', closeMatch)

module.exports = router
