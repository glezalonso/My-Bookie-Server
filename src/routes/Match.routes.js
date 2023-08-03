const express = require('express')
const router = express.Router()
const {
    getMatches,
    getMatch,
    createMatch,
    updateMatch,
    deleteMatch,
    addLineUp,
    removeLineUp,
    closeMatch,
    addComment,
    removeComment,
    getMatchesToday,
    getMatchesByRound,
    getMatchesBySeason,
    getMatchesOpen,
    getMatchesClosed,
    getMatchesByTeam,
    getNextMatchesBySport,
    getMatchesOpenByLeague,
    getMatchesClosedByLeague,
    pickem,
    getMatchBookieClosed,
    getMatchBookieOpen,
} = require('../controllers/Match.controllers')
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

router.post('/pickem', verifyToken, pickem)

// Extra endpoints
router.get(`/matchbookieclosed/:id/:date`, verifyToken, getMatchBookieClosed)

router.put(`/matchbookieopen/:id`, verifyToken, getMatchBookieOpen)

router.post('/matchestoday', getMatchesToday)

router.post('/matchesopenbyleague', getMatchesOpenByLeague)

router.post('/matchesclosedbyleague', getMatchesClosedByLeague)

router.post('/matchesbyround', getMatchesByRound)

router.post('/matchesbyseason', getMatchesBySeason)

router.post('/matchesteams', getMatchesByTeam)

router.post('/matchesopen', getMatchesOpen)

router.post('/matchesclosed', getMatchesClosed)

router.post('/nextmatchesbysport', getNextMatchesBySport)

module.exports = router
