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
    getMatchesTodaySport,
    getMatchesPanel,
    getMatchesH2H,
    trendMatch,
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
router.get(`/matchbookieclosed/:id/:limit`, verifyToken, getMatchBookieClosed)

router.get(`/matchbookieopen/:id/:limit`, verifyToken, getMatchBookieOpen)

router.get('/today/:page/:date/:sport', getMatchesToday)

router.get('/matchestoday/:date', getMatchesPanel)

router.get('/todaybysport/:sport/:date', getMatchesTodaySport)

router.get('/headtohead/:local/:away', getMatchesH2H)

router.get('/openleague/:league/:limit', getMatchesOpenByLeague)

router.get('/closedleague/:league/:limit', getMatchesClosedByLeague)

router.get('/round/:round', getMatchesByRound)

router.get('/season/:season', getMatchesBySeason)

router.get('/team/:team/:limit/:status', getMatchesByTeam)

router.get('/open', getMatchesOpen)

router.get('/closed', getMatchesClosed)

router.get('/nextmatches/sport/:sport', getNextMatchesBySport)

router.get(`/trendmatch/:date`, trendMatch)

module.exports = router
