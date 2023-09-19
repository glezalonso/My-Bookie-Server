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
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
}

const createMatch = (req, res) => {
    const {
        date,
        teamHome,
        teamAway,
        oddHome,
        oddAway,
        oddOverUnder,
        oddDraw,
        round,
        season,
        league,
        sport,
        status,
        moreImportant,
    } = req.body
    const newMatch = new MatchModel({
        date,
        local: teamHome,
        away: teamAway,
        round,
        season,
        league,
        sport,
        status,
        oddHome,
        oddAway,
        oddOverUnder,
        oddDraw,
        moreImportant,
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
    const {
        date,
        teamHome,
        teamAway,
        oddHome,
        oddAway,
        oddOverUnder,
        oddDraw,
        round,
        season,
        league,
        status,
        sport,
        moreImportant,
    } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
            oddHome,
            oddAway,
            oddOverUnder,
            oddDraw,
            moreImportant,
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
}

const deleteMatch = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    MatchModel.findOneAndDelete({ _id: id })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al intentar borrar el juego',
                error,
            })
        )
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

        const date = userVotes.date.slice(0, 10)

        const sport = userVotes.sport.toString()

        const round = userVotes.round.toString()

        const season = userVotes.season.toString()

        const league = userVotes.league.toString()

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
                    {
                        $inc: { success: 1, total: 1 },
                        $push: {
                            matchesSuccess: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
                )
            })

            votesAway.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    {
                        $inc: { failures: 1, total: 1 },
                        $push: {
                            matchesFailure: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
                )
            })

            votesDraw.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    {
                        $inc: { failures: 1, total: 1 },
                        $push: {
                            matchesFailure: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
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
                    {
                        $inc: { success: 1, total: 1 },
                        $push: {
                            matchesSuccess: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
                )
            })

            votesLocal.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    {
                        $inc: { failures: 1, total: 1 },
                        $push: {
                            matchesFailure: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
                )
            })
            votesDraw.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    {
                        $inc: { failures: 1, total: 1 },
                        $push: {
                            matchesFailure: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
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
                    {
                        $inc: { failures: 1, total: 1 },
                        $push: {
                            matchesFailure: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
                )
            })

            votesLocal.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    {
                        $inc: { failures: 1, total: 1 },
                        $push: {
                            matchesFailure: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
                )
            })
            votesDraw.forEach(async (element) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: element.username },
                    {
                        $inc: { success: 1, total: 1 },
                        $push: {
                            matchesSuccess: {
                                match: id,
                                date,
                                sport,
                                round,
                                season,
                                league,
                            },
                        },
                    }
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
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
}

const removeLineUp = (req, res) => {
    const { id } = req.params
    const { playerId, lineId, type } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
}

const addComment = (req, res) => {
    const { id } = req.params
    const { userId, hour, comment } = req.body

    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    MatchModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { username: userId, hour, comment } } },
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
}

const removeComment = (req, res) => {
    const { id } = req.params
    const { userId, comment, hour, commentId } = req.body

    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    MatchModel.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                comments: { username: userId, hour, comment, _id: commentId },
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
}

const getMatchesToday = async (req, res) => {
    const { date, sport } = req.params
    const page = parseInt(req.params.page)
    const perPage = 8

    if (sport === 'all') {
        const total = await MatchModel.count({
            moreImportant: true,
            date: { $regex: date, $options: 'i' },
        })

        const totalPages = Math.ceil(total / perPage)

        MatchModel.find({
            moreImportant: true,
            date: { $regex: date, $options: 'i' },
        })
            .sort({ status: 'desc', date: 'asc', _id: 'desc' })
            .skip(page * perPage - perPage)
            .limit(perPage)
            .populate(
                'round season league local away sport lineup.local.playerId lineup.away.playerId comments.username votes.username',
                { __v: 0 }
            )

            .then((data) =>
                res.status(200).json({ data, total, page, totalPages })
            )
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    } else {
        const total = await MatchModel.count({
            sport,
            date: { $regex: date, $options: 'i' },
        })

        const totalPages = Math.ceil(total / perPage)
        MatchModel.find({ sport, date: { $regex: date, $options: 'i' } })
            .sort({ status: 'desc', date: 'asc', _id: 'desc' })
            .skip(page * perPage - perPage)
            .limit(perPage)
            .populate(
                'round season league local away sport lineup.local.playerId lineup.away.playerId comments.username votes.username',
                { __v: 0 }
            )

            .then((data) =>
                res.status(200).json({ data, total, page, totalPages })
            )
            .catch((error) =>
                res.status(501).json({
                    message: 'Ha ocurrido un error al mostrarlos juegos',
                    error,
                })
            )
    }
}

const getMatchesTodaySport = async (req, res) => {
    const { date, sport } = req.params
    MatchModel.find({ sport, date: { $regex: date, $options: 'i' } })
        .populate(
            'round season league local away sport lineup.local.playerId lineup.away.playerId comments.username votes.username',
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
const getMatchesPanel = async (req, res) => {
    const { date } = req.params
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

const getMatchesByLeague = (req, res) => {
    const { league, limit, status } = req.params
    if (!ObjectId.isValid(league))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    MatchModel.find({ league, status })
        .populate(
            'round season league local away sport lineup.local.playerId lineup.away.playerId comments.username votes.username',
            {
                __v: 0,
            }
        )
        .limit(limit)
        .sort(status ? { date: 'asc' } : { data: 'desc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

const getMatchesByRound = (req, res) => {
    const { round } = req.params
    if (!ObjectId.isValid(round))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
}

const getMatchesBySeason = (req, res) => {
    const { season } = req.params
    if (!ObjectId.isValid(season))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
}

const getMatchesByTeam = (req, res) => {
    const { team, limit, status } = req.params
    if (!ObjectId.isValid(team))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })

    MatchModel.find({
        $or: [
            { away: team, status },
            { local: team, status },
        ],
    })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .limit(limit)
        .sort({ date: 'asc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
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
const getMatchesH2H = (req, res) => {
    const { local, away } = req.params

    MatchModel.find({
        status: false,
        $or: [
            {
                $and: [{ local }, { away }],
            },
            {
                $and: [{ local: away }, { away: local }],
            },
        ],
    })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .sort({ date: 'desc' })
        .limit(10)
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
    const { sport } = req.params
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

    if (!ObjectId.isValid(match))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    const existVote = await MatchModel.findOne({
        _id: match,
        votes: { $elemMatch: { username: userId } },
    })
    if (existVote)
        return res.status(500).json({ message: 'Ya se ha colocado su voto' })

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
}

const getMatchBookie = async (req, res) => {
    const { id, status } = req.params
    const page = parseInt(req.params.page)
    const perPage = 15

    const total = await MatchModel.count({
        votes: { $elemMatch: { username: id } },
        status,
    })

    const totalPages = Math.ceil(total / perPage)
    MatchModel.find({
        votes: { $elemMatch: { username: id } },
        status,
    })
        .populate('round season league local away sport votes.username', {
            __v: 0,
        })
        .sort({ status: 'desc', date: 'desc', _id: 'desc' })
        .skip(page * perPage - perPage)
        .limit(perPage)
        .then((data) => res.status(200).json({ data, page, totalPages }))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al mostrarlos juegos',
                error,
            })
        )
}

const trendMatch = async (req, res) => {
    const { date } = req.params
    try {
        const matches = await MatchModel.find({
            moreImportant: true,
            date: { $regex: date, $options: 'i' },
        })
        matches.sort((a, b) => b.votes.length - a.votes.length)

        const trends = matches.slice(0, 1)

        res.status(200).json(trends)
    } catch (error) {
        res.status(501).json({
            message: 'Ha ocurrido un error al mostrarlos juegos',
            error,
        })
    }
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
    getMatchesByLeague,
    getMatchesByRound,
    getMatchesBySeason,
    getMatchesClosed,
    getMatchesOpen,
    getMatchesByTeam,
    getNextMatchesBySport,
    pickem,
    getMatchesTodaySport,
    getMatchesPanel,
    getMatchesH2H,
    trendMatch,
    getMatchBookie,
}
