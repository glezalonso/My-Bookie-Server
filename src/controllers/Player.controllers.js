const PlayerModel = require('../models/Player.model')

const getPlayers = (req, res) => {
  PlayerModel.find({})
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al cargar jugadores  ', error }))
}

const getPlayer = (req, res) => {
  const { id } = req.params
  PlayerModel.findOne({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al cargar jugadores  ', error }))
}

const createPlayer = (req, res) => {
  const { fullName, photo, position, status, sport } = req.body
  const newPlayer = new PlayerModel({
    fullName,
    photo,
    position,
    status,
    sport
  })
  newPlayer.save()
    .then(data => res.status(201).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al crear el jugador ', error }))
}

const updatePlayer = (req, res) => {
  const { id } = req.params
  const { fullName, photo, position, status, sport } = req.body
  PlayerModel.findOneAndUpdate({ _id: id }, {
    fullName,
    photo,
    position,
    status,
    sport
  }, { new: true })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al actualizar el jugador', error }))
}

const deletePlayer = (req, res) => {
  const { id } = req.params
  PlayerModel.findOneAndDelete({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.staus(501).send({ message: 'Ha ocurrido un error al intentar borrar el usuario', error }))
}

module.exports = { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer }
