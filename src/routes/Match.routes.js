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
    pickem,
    getMatchesTodaySport,
    getMatchesPanel,
    getMatchesH2H,
    trendMatch,
    getMatchBookie,
    getMatchesByLeague,
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

router.get(`/matchbookie/:id/:status/:page`, verifyToken, getMatchBookie)

router.get('/today/:page/:date', getMatchesToday)

router.get('/todaysport/:page/:date/:sport', getMatchesTodaySport)

router.get('/matchestoday/:date', getMatchesPanel)

router.get('/headtohead/:local/:away', getMatchesH2H)

router.get('/league/:league/:limit/:status', getMatchesByLeague)

router.get('/round/:round', getMatchesByRound)

router.get('/season/:season', getMatchesBySeason)

router.get('/team/:team/:limit/:status', getMatchesByTeam)

router.get('/open', getMatchesOpen)

router.get('/closed', getMatchesClosed)

router.get('/nextmatches/sport/:sport', getNextMatchesBySport)

router.get(`/trendmatch/:date`, trendMatch)

module.exports = router
