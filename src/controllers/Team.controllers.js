const PlayerModel = require('../models/Player.model')
const TeamModel = require('../models/Team.model')
const ObjectId = require('mongoose').Types.ObjectId
const { upload } = require('../libs/cloudinary')

const getTeams = (req, res) => {
    TeamModel.find({})
        .populate('players.playerId', { __v: 0, status: 0, photo: 0, sport: 0 })
        .populate('sport', { description: 0, poster: 0, __v: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar los equipos',
                error,
            })
        )
}

const getTeam = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    TeamModel.findOne({ _id: id })
        .populate('players.playerId', {
            __v: 0,
            status: 0,
            photo: 0,
            sport: 0,
        })
        .populate('sport', { description: 0, poster: 0, __v: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar los equipos',
                error,
            })
        )
}

const createTeam = async (req, res) => {
    const { name, stadium, status, sport } = req.body
    if (req.files) {
        const { poster } = req.files
        try {
            const { secure_url } = await upload(poster.tempFilePath)
            const newTeam = new TeamModel({
                name,
                poster: secure_url,
                stadium,
                status,
                sport,
            })
            newTeam
                .save()
                .then((data) => res.status(200).json(data))
                .catch((error) =>
                    res.status(505).json({
                        message: 'Ha ocurrido un error al crear el equipo',
                        error,
                    })
                )
        } catch (error) {
            console.log(error)
            res.status(501).json({ message: 'Hubo un error en la petición' })
        }
    } else {
        const newTeam = new TeamModel({
            name,

            stadium,
            status,
            sport,
        })
        newTeam
            .save()
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(505).json({
                    message: 'Ha ocurrido un error al crear el equipo',
                    error,
                })
            )
    }
}

const addPlayer = (req, res) => {
    const { id } = req.params
    const { playerId } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })
    TeamModel.findOneAndUpdate(
        { _id: id },
        { $push: { players: { playerId } } },
        { new: true }
    )
        .populate('players', {
            poster: 0,
            __v: 0,
            status: 0,
            photo: 0,
            sport: 0,
        })
        .populate('sport', { description: 0, poster: 0, __v: 0 })
        .then((data) => {
            PlayerModel.findOneAndUpdate(
                { _id: playerId },
                { team: id },
                { new: true }
            )
                .then((data) => res.status(200).json(data))
                .catch((error) => res.status(500).json({ error }))
        })
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al agregar el jugador',
                error,
            })
        )
}

const removePlayer = (req, res) => {
    const { id } = req.params
    const { playerId } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })
    TeamModel.findOneAndUpdate(
        { _id: id },
        { $pull: { players: { playerId } } },
        { new: true }
    )
        .populate('players', {
            poster: 0,
            __v: 0,
            status: 0,
            photo: 0,
            sport: 0,
        })
        .populate('sport', { description: 0, poster: 0, __v: 0 })
        .then((data) => {
            PlayerModel.findOneAndUpdate(
                { _id: playerId },
                { team: null },
                { new: true }
            ).then((data) => res.status(202).json(data))
        })
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al remover el jugador',
                error,
            })
        )
}

const updateTeam = async (req, res) => {
    const { id } = req.params
    const { name, stadium, status, sport } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })
    if (req.files) {
        const { poster } = req.files
        try {
            const { secure_url } = await upload(poster.tempFilePath)
            TeamModel.findOneAndUpdate(
                { _id: id },
                {
                    name,
                    poster: secure_url,
                    stadium,
                    status,
                    sport,
                },
                { new: true }
            )
                .then((data) => res.status(200).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message:
                            'Ha ocurrido un error al tratar de actualizar equipo',
                        error,
                    })
                )
        } catch (error) {
            res.status(501).json({
                message: 'Hubo un error en la petición',
                error,
            })
        }
    } else {
        TeamModel.findOneAndUpdate(
            { _id: id },
            {
                name,
                stadium,
                status,
                sport,
            },
            { new: true }
        )
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message:
                        'Ha ocurrido un error al tratar de actualizar equipo',
                    error,
                })
            )
    }
}

const deleteTeam = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })
    TeamModel.findOneAndDelete({ _id: id })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al eliminar el equipo',
                error,
            })
        )
}

const getTeamBySport = (req, res) => {
    const { sport } = req.params
    if (!ObjectId.isValid(sport))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    TeamModel.find({ sport })
        .populate('players.playerId', {
            __v: 0,
            status: 0,
            photo: 0,
            sport: 0,
        })
        .populate('sport', { description: 0, poster: 0, __v: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar los equipos',
                error,
            })
        )
}

module.exports = {
    getTeams,
    getTeam,
    createTeam,
    addPlayer,
    removePlayer,
    updateTeam,
    deleteTeam,
    getTeamBySport,
}
