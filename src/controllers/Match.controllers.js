const MatchModel = require('../models/Match.model')
const SeasonModel = require('../models/Season.model')
const BookiesModel = require('../models/Bookies.model')
const ObjectId = require('mongoose').Types.ObjectId

const getMatches = (req, res) => {
    MatchModel.find({})
        .populate(
            'round season league local away sport votes.username comments.username',
            {
                __v: 0,
            }
        )
        .sort({ date: 'asc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

const getMatch = (req, res) => {
    const { id } = req.params
    if (ObjectId.isValid(id)) {
        MatchModel.findOne({ _id: id })
            .populate(
                'round season league local away sport lineup.local.playerId lineup.away.playerId votes.username comments.username',
                { __v: 0 }
            )
            .sort({ date: 'asc' })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostar los juegos',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const createMatch = (req, res) => {
    const { date, teamHome, teamAway, round, season, league, sport, status } =
        req.body
    const newMatch = new MatchModel({
        date,
        local: teamHome,
        away: teamAway,
        round,
        season,
        league,
        sport,
        status,
    })
    newMatch
        .save()
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al crear el juego, error',
                error,
            })
        )
}

const updateMatch = (req, res) => {
    const { id } = req.params
    const { date, teamHome, teamAway, round, season, league, status, sport } =
        req.body
    if (ObjectId.isValid(id)) {
        MatchModel.findOneAndUpdate(
            { _id: id },
            {
                date,
                local: teamHome,
                away: teamAway,
                round,
                season,
                league,
                sport,
                status,
            },
            { new: true }
        )
            .then((data) => res.status(201).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al actualizar el juego',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const deleteMatch = (req, res) => {
    const { id } = req.params
    if (ObjectId.isValid(id)) {
        MatchModel.findOneAndDelete({ _id: id })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al intentar borrar el juego',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const closeMatch = async (req, res) => {
    const { id } = req.params
    const { local, away } = req.body

    if (!ObjectId.isValid(id))
        return res
            .status(501)
            .json({ messsage: 'Ha ocurrido un error en la peticion' })
    try {
        const placeScore = await MatchModel.findOneAndUpdate(
            { _id: id },
            { score: { local, away }, status: false },
            { new: true }
        )
        const { local: localId, away: awayId, season: seasonId } = placeScore

        const userVotes = await MatchModel.findOne({ _id: id })

        const votesAway = userVotes.votes.filter(
            (data) => data.option === 'away'
        )
        const votesLocal = userVotes.votes.filter(
            (data) => data.option === 'local'
        )
        const votesDraw = userVotes.votes.filter(
            (data) => data.option === 'draw'
        )

        if (local > away) {
            votesLocal.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { success: 1, total: 1 } }
                )
            })

            votesAway.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { failures: 1, total: 1 } }
                )
            })

            votesDraw.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { failures: 1, total: 1 } }
                )
            })

            await SeasonModel.updateOne(
                {
                    _id: seasonId,
                    standings: { $elemMatch: { team: awayId } },
                },
                { $inc: { 'standings.$.loses': 1 } }
            )
            await SeasonModel.updateOne(
                {
                    _id: seasonId,
                    standings: { $elemMatch: { team: localId } },
                },
                { $inc: { 'standings.$.wins': 1 } }
            )
        } else if (away > local) {
            votesAway.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { success: 1 } }
                )
            })

            votesLocal.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { failures: 1 } }
                )
            })
            votesDraw.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { failures: 1 } }
                )
            })
            await SeasonModel.updateOne(
                {
                    _id: seasonId,
                    standings: { $elemMatch: { team: localId } },
                },
                { $inc: { 'standings.$.loses': 1 } }
            )
            await SeasonModel.updateOne(
                {
                    _id: seasonId,
                    standings: { $elemMatch: { team: awayId } },
                },
                { $inc: { 'standings.$.wins': 1 } }
            )
        } else {
            votesAway.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { failures: 1, total: 1 } }
                )
            })

            votesLocal.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { failures: 1, total: 1 } }
                )
            })
            votesDraw.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    { $inc: { success: 1, total: 1 } }
                )
            })
            await SeasonModel.updateOne(
                {
                    _id: seasonId,
                    standings: { $elemMatch: { team: localId } },
                },
                { $inc: { 'standings.$.draws': 1 } }
            )
            await SeasonModel.updateOne(
                {
                    _id: seasonId,
                    standings: { $elemMatch: { team: awayId } },
                },
                { $inc: { 'standings.$.draws': 1 } }
            )
        }
        res.status(201).json(placeScore)
    } catch (error) {
        console.log(error)
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion 2',
        })
    }
}

const addLineUp = (req, res) => {
    const { id } = req.params
    const { playerId, type } = req.body
    if (ObjectId.isValid(id)) {
        if (type === 'local') {
            MatchModel.findOneAndUpdate(
                { _id: id },
                { $push: { lineup: { local: { playerId } } } },
                { new: true }
            )
                .then((data) => res.status(201).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message:
                            'Ha ocurrido un error al agregar el jugador a la alineación local',
                        error,
                    })
                )
        } else {
            MatchModel.findOneAndUpdate(
                { _id: id },
                { $push: { lineup: { away: { playerId } } } },
                { new: true }
            )
                .then((data) => res.status(201).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message:
                            'Ha ocurrido un error al agregar el jugador a la alineación visitante',
                        error,
                    })
                )
        }
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const removeLineUp = (req, res) => {
    const { id } = req.params
    const { playerId, lineId, type } = req.body
    if (ObjectId.isValid(id)) {
        if (type === 'local') {
            MatchModel.findOneAndUpdate(
                { _id: id },
                { $pull: { lineup: { local: { playerId, _id: lineId } } } },
                { new: true }
            )
                .then((data) => res.status(201).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message:
                            'Ha ocurrido un error al remover el jugador a la alineación visitante',
                        error,
                    })
                )
        } else {
            MatchModel.findOneAndUpdate(
                { _id: id },
                { $pull: { lineup: { away: { playerId, _id: lineId } } } },
                { new: true }
            )
                .then((data) => res.status(201).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message:
                            'Ha ocurrido un error al remover el jugador a la alineación visitante',
                        error,
                    })
                )
        }
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const addComment = (req, res) => {
    const { id } = req.params
    const { userId, comment } = req.body

    if (ObjectId.isValid(id)) {
        MatchModel.findOneAndUpdate(
            { _id: id },
            { $push: { comments: { username: userId, comment } } },
            { new: true }
        )
            .then(() =>
                res
                    .status(202)
                    .json({ message: 'Se ha agregado comentario exitosamente' })
            )
            .catch((error) =>
                res.status(500).json({
                    message: 'Ha ocurrido un error al agregar el post',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const removeComment = (req, res) => {
    const { id } = req.params
    const { userId, comment, commentId } = req.body

    if (ObjectId.isValid(id)) {
        MatchModel.findOneAndUpdate(
            { _id: id },
            {
                $pull: {
                    comments: { username: userId, comment, _id: commentId },
                },
            },
            { new: true }
        )
            .then(() =>
                res
                    .status(202)
                    .json({ message: 'Se ha borrado comentario exitosamente' })
            )
            .catch((error) =>
                res.status(500).json({
                    message: 'Ha ocurrido un error al borrar el post',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchesToday = (req, res) => {
    const { date } = req.body
    MatchModel.find({ date: { $regex: date, $options: 'i' } })
        .populate(
            'round season league local away sport lineup.local.playerId lineup.away.playerId comments.username',
            { __v: 0 }
        )
        .sort({ date: 'asc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

const getMatchesOpenByLeague = (req, res) => {
    const { league } = req.body
    if (ObjectId.isValid(league)) {
        MatchModel.find({ league, status: true })
            .populate('round season league local away sport votes.username', {
                __v: 0,
            })
            .limit('100')
            .sort({ date: 'asc' })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchesClosedByLeague = (req, res) => {
    const { league } = req.body
    if (ObjectId.isValid(league)) {
        MatchModel.find({ league, status: false })
            .populate('round season league local away sport votes.username', {
                __v: 0,
                password: 0,
            })
            .limit('100')
            .sort({ date: 'asc' })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchesByRound = (req, res) => {
    const { round } = req.body
    if (ObjectId.isValid(round)) {
        MatchModel.find({ round })
            .populate('round season league local away sport votes.username', {
                __v: 0,
            })
            .sort({ date: 'asc' })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchesBySeason = (req, res) => {
    const { season } = req.body
    if (ObjectId.isValid(season)) {
        MatchModel.find({ season })
            .populate('round season league local away sport votes.username', {
                __v: 0,
            })
            .sort({ date: 'asc' })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchesByTeam = (req, res) => {
    const { team } = req.body
    if (ObjectId.isValid(team)) {
        MatchModel.find({ $or: [{ away: team }, { local: team }] })
            .populate('round season league local away sport votes.username', {
                __v: 0,
            })
            .sort({ date: 'asc' })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchesOpen = (req, res) => {
    MatchModel.find({ status: true })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .limit('100')
        .sort({ date: 'asc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

const getMatchesClosed = (req, res) => {
    MatchModel.find({ status: false })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .limit('100')
        .sort({ date: 'asc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}
const getNextMatchesBySport = (req, res) => {
    const { sport } = req.body
    MatchModel.find({ sport, status: true })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .limit('100')
        .sort({ date: 'asc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

const pickem = async (req, res) => {
    const { option, userId, match } = req.body

    if (ObjectId.isValid(match)) {
        const existVote = await MatchModel.findOne({
            _id: match,
            votes: { $elemMatch: { username: userId } },
        })
        if (existVote)
            return res
                .status(500)
                .json({ message: 'Ya se ha colocado su voto' })

        MatchModel.findOneAndUpdate(
            { _id: match },
            { $push: { votes: { username: userId, option } } }
        )
            .then(async () => {
                await BookiesModel.findOneAndUpdate(
                    { _id: userId },
                    { $push: { votes: { match, option } } },
                    { new: true }
                )
            })
            .then(() =>
                res.status(202).json({
                    message: 'Se ha agregado el voto exitosamente',
                })
            )
            .catch((error) =>
                res.status(500).json({
                    message: 'Ha ocurrido un error al agregar el voto',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const getMatchBookieClosed = (req, res) => {
    const { id, date } = req.params
    MatchModel.find({
        date: { $regex: date, $options: 'i' },
        votes: { $elemMatch: { username: id } },
        status: false,
    })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .sort({ date: 'desc' })

        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}
const getMatchBookieOpen = (req, res) => {
    const { id } = req.params
    MatchModel.find({
        votes: { $elemMatch: { username: id } },
        status: true,
    })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .sort({ date: 'asc' })
        .limit('15')
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

module.exports = {
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
    getMatchesOpenByLeague,
    getMatchesClosedByLeague,
    getMatchesByRound,
    getMatchesBySeason,
    getMatchesClosed,
    getMatchesOpen,
    getMatchesByTeam,
    getNextMatchesBySport,
    pickem,
    getMatchBookieClosed,
    getMatchBookieOpen,
}
