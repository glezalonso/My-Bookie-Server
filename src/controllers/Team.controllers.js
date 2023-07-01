const PlayerModel = require('../models/Player.model')
const TeamModel = require('../models/Team.model')
const ObjectId = require('mongoose').Types.ObjectId

const getTeams = (req, res) => {
  TeamModel.find({})
    .populate('players.playerId', { __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al cargar los equipos', error }))
}

const getTeam = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    TeamModel.findOne({ _id: id }).populate('players.playerId', { __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al cargar los equipos', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const createTeam = (req, res) => {
  const { name, poster, stadium, status, sport } = req.body
  const newTeam = new TeamModel({
    name,
    poster,
    stadium,
    status,
    sport
  })
  newTeam.save()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(505).json({ message: 'Ha ocurrido un error al crear el equipo', error }))
}

const addPlayer = (req, res) => {
  const { id } = req.params
  const { playerId } = req.body
  if (ObjectId.isValid(id)) {
    TeamModel.findOneAndUpdate({ _id: id }, { $push: { players: { playerId } } }, { new: true }).populate('players', { poster: 0, __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
      .then(data => {
        PlayerModel.findOneAndUpdate({ _id: playerId }, { team: id }, { new: true })
          .then(data => res.status(200).json(data))
          .catch(error => res.status(500).json({ error }))
      })
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al agregar el jugador', error }))
  } else {
    res.status(501).json({ message: 'Hubo un error en la petición' })
  }
}

const removePlayer = (req, res) => {
  const { id } = req.params
  const { playerId } = req.body
  if (ObjectId.isValid(id)) {
    TeamModel.findOneAndUpdate({ _id: id }, { $pull: { players: { playerId } } }, { new: true }).populate('players', { poster: 0, __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
      .then(data => {
        PlayerModel.findOneAndUpdate({ _id: playerId }, { team: null }, { new: true })
          .then(data => res.status(202).json(data))
      })
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al remover el jugador', error }))
  } else {
    res.status(501).json({ message: 'Hubo un error en la petición' })
  }
}

const updateTeam = (req, res) => {
  const { id } = req.params
  const { name, poster, stadium, status, sport } = req.body
  if (ObjectId.isValid(id)) {
    TeamModel.findOneAndUpdate({ _id: id }, {
      name,
      poster,
      stadium,
      status,
      sport
    }, { new: true })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al tratar de actualizar equipo', error }))
  } else {
    res.status(501).json({ message: 'Hubo un error en la petición' })
  }
}

const deleteTeam = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    TeamModel.findOneAndDelete({ _id: id })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al eliminar el equipo', error }))
  } else {
    res.status(501).json({ message: 'Hubo un error en la petición' })
  }
}

module.exports = { getTeams, getTeam, createTeam, addPlayer, removePlayer, updateTeam, deleteTeam }
