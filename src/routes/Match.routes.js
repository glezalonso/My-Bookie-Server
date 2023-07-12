const express = require('express')
const router = express.Router()
const { getMatches, getMatch, createMatch, updateMatch, deleteMatch, addLineUp, removeLineUp, closeMatch, addComment, removeComment, getMatchesToday, getMatchesByLeague, getMatchesByRound, getMatchesBySeason, getMatchesOpen, getMatchesClosed, getMatchesByTeam } = require('../controllers/Match.controllers')
const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getMatches)

router.get('/:id', getMatch)

router.post('/', verifyToken, createMatch)

router.put('/:id', verifyToken, updateMatch)

router.delete('/:id', verifyToken, deleteMatch)

router.post('/addlineup/:id', verifyToken, addLineUp)

router.delete('/removelineup/:id', verifyToken, removeLineUp)

router.put('/closematch/:id', verifyToken, closeMatch)

router.put('/addComment/:id', verifyToken, addComment)

router.put('/removeComment/:id', verifyToken, removeComment)

// Extra endponints
router.post('/matchestoday', getMatchesToday)

router.post('/matchesbyleague', getMatchesByLeague)

router.post('/matchesbyround', getMatchesByRound)

router.post('/matchesbyseason', getMatchesBySeason)

router.post('/matchesteams', getMatchesByTeam)

router.post('/matchesopen', getMatchesOpen)

router.post('/matchesclosed', getMatchesClosed)

module.exports = router
