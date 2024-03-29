const PlayerModel = require('../models/Player.model')
const ObjectId = require('mongoose').Types.ObjectId

const getPlayers = (req, res) => {
    PlayerModel.find({})
        .populate('sport team', { __v: 0, description: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar jugadores  ',
                error,
            })
        )
}

const getPlayer = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    PlayerModel.findOne({ _id: id })
        .populate('sport team', { __v: 0, description: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar jugadores  ',
                error,
            })
        )
}

const createPlayer = (req, res) => {
    const { fullName, position, status, sport } = req.body
    const newPlayer = new PlayerModel({
        fullName,
        position,
        status,
        sport,
    })
    newPlayer
        .save()
        .then((data) => res.status(201).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al crear el jugador ',
                error,
            })
        )
}

const updatePlayer = (req, res) => {
    const { id } = req.params
    const { fullName, position, status, sport } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    PlayerModel.findOneAndUpdate(
        { _id: id },
        {
            fullName,
            position,
            status,
            sport,
        },
        { new: true }
    )
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al actualizar el jugador',
                error,
            })
        )
}

const deletePlayer = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    PlayerModel.findOneAndDelete({ _id: id })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.staus(501).json({
                message: 'Ha ocurrido un error al intentar borrar el usuario',
                error,
            })
        )
}
const getPlayerBySport = (req, res) => {
    const { sport } = req.params
    if (!ObjectId.isValid(sport))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    PlayerModel.find({ sport })
        .populate('sport team', { __v: 0, poster: 0, description: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar jugadores  ',
                error,
            })
        )
}
const getPlayersTeamless = (req, res) => {
    const { sport } = req.params
    if (!ObjectId.isValid(sport))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    PlayerModel.find({ sport, team: null })
        .populate('sport team', { __v: 0, poster: 0, description: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Ha ocurrido un error al cargar jugadores  ',
                error,
            })
        )
}

module.exports = {
    getPlayers,
    getPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerBySport,
    getPlayersTeamless,
}
