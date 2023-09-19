const TournamentModel = require('../models/Tournament.model')
const ObjectId = require('mongoose').Types.ObjectId
const BookieModel = require('../models/Bookies.model')

const getTournaments = (req, res) => {
    TournamentModel.find({})
        .populate('season')
        .sort({ status: -1 })
        .then((data) => res.status(200).json(data || []))
        .catch((error) =>
            res.status(500).json({
                message: 'ha ocurrido un error al mostrar los torneos',
                error,
            })
        )
}

const getTournament = (req, res) => {
    const { id } = req.params
    console.log(id)
    if (!ObjectId.isValid(id))
        return res
            .status(500)
            .json({ message: 'Ha ocurrido un error en la peticion' })

    TournamentModel.findOne({ _id: id })
        .populate('season')
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'ha ocurrido un error al mostrar los torneos',
                error,
            })
        )
}

const createTournament = (req, res) => {
    const { season, status, minimum, bookie, votes, success } = req.body

    const newTournament = new TournamentModel({
        season,
        status,
        minimum,
        bookie,
        votes,
        success,
    })
    newTournament
        .save()
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: ' ha ocurrido un error al crear el torneo',
                error,
            })
        )
}

const updateTournament = async (req, res) => {
    const { id } = req.params
    const { season, status, minimum, bookie, votes, success } = req.body
    const winner = await BookieModel.findOneAndUpdate(
        { _id: bookie },
        { $push: { tournaments: id } }
    )

    TournamentModel.findOneAndUpdate(
        { _id: id },
        {
            season,
            status,
            minimum,
            bookie,
            votes,
            success,
        },
        {
            new: true,
        }
    )
        .then((data) => res.status(200).json({ data, winner }))
        .catch((error) =>
            res.status(500).json({
                message: ' ha ocurrido un error al crear el torneo',
                error,
            })
        )
}

const getTournamentsStatus = (req, res) => {
    const { status } = req.params
    TournamentModel.find({ status })
        .populate('season')
        .sort({ status: -1 })
        .then((data) => res.status(200).json(data || []))
        .catch((error) =>
            res.status(500).json({
                message: 'ha ocurrido un error al mostrar los torneos',
                error,
            })
        )
}

module.exports = {
    getTournaments,
    getTournament,
    createTournament,
    updateTournament,
    getTournamentsStatus,
}
