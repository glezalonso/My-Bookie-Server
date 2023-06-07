const TeamModel = require('../models/Team.model')

const getTeams = (req, res) => {
  TeamModel.find({})
    .populate('players', { poster: 0, __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al cargar los equipos' }, error))
}

const getTeam = (req, res) => {
  const { id } = req.params
  TeamModel.findOne({ _id: id }).populate('players', { poster: 0, __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al cargar los equipos' }, error))
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
    .then(data => res.status(200).send(data))
    .catch(error => res.status(505).send({ message: 'Ha ocurrido un error al crear el equipo' }, error))
}

const addPlayer = (req, res) => {
  const { id } = req.params
  const { playerId, player } = req.body
  console.log(req.body)
  TeamModel.findOneAndUpdate({ _id: id }, { $push: { players: { playerId, player } } }, { new: true }).populate('players', { poster: 0, __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
    .then(data => res.send(data))
    .catch()
}

const removePlayer = (req, res) => {
  const { id } = req.params
  const { playerId, player } = req.body
  console.log(req.body)
  TeamModel.findOneAndUpdate({ _id: id }, { $pull: { players: { playerId, player } } }, { new: true }).populate('players', { poster: 0, __v: 0, status: 0, photo: 0, sport: 0 }).populate('sport', { description: 0, poster: 0, __v: 0 })
    .then(data => res.send(data))
    .catch()
}

const updateTeam = (req, res) => {
  const { id } = req.params
  const { name, poster, stadium, status, sport } = req.body
  TeamModel.findOneAndUpdate({ _id: id }, {
    name,
    poster,
    stadium,
    status,
    sport
  }, { new: true })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al tratar de actualizar equipo', error }))
}

const deleteTeam = (req, res) => {
  const { id } = req.params
  TeamModel.findOneAndDelete({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al eliminar el equipo', error }))
}

module.exports = { getTeams, getTeam, createTeam, addPlayer, removePlayer, updateTeam, deleteTeam }
