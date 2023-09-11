const TournamentModel = require('../models/Tournament.model')
const ObjectId = require('mongoose').Types.ObjectId

const getTournaments = (req, res) => {
    TournamentModel.find({})
        .populate('season')
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
    const { season, status } = req.body

    const newTournament = new TournamentModel({
        season,
        status,
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

const updateTournament = (req, res) => {
    const { id } = req.params
    const { season, status } = req.body

    TournamentModel.findOneAndUpdate(
        { _id: id },
        {
            season,
            status,
        },
        {
            new: true,
        }
    )
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: ' ha ocurrido un error al crear el torneo',
                error,
            })
        )
}

module.exports = {
    getTournaments,
    getTournament,
    createTournament,
    updateTournament,
}
