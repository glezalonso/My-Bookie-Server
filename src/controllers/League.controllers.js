const LeagueModel = require('../models/League.model')

const getLeagues = (req, res) => {
  LeagueModel.find().populate('sport', { __v: 0, status: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No hay ligas para mostrar ', error }))
}

const getLeague = (req, res) => {
  const { id } = req.params
  LeagueModel.findOne({ _id: id }).populate('sport', { __v: 0, status: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No hay ligas para mostrar', error }))
}

const createLeague = (req, res) => {
  const { league, description, sport, poster } = req.body
  const newLeague = new LeagueModel({
    league,
    description,
    poster,
    sport
  })
  newLeague.save()
    .then(data => res.status(201).send(data))
    .catch(error => res.status(501).send({ message: 'Hubo un error al crear la liga ', error }))
}

const updateLeague = async (req, res) => {
  const { id } = req.params
  const { league, description, sport, poster } = req.body
  await LeagueModel.findOneAndUpdate({ _id: id }, {
    league,
    description,
    poster,
    sport
  }, { new: true })
    .then(data => res.status(201).send(data))
    .catch(error => res.status(501).send({ message: 'No se podido actualizar la liga ', error }))
}

const deleteLeague = (req, res) => {
  const { id } = req.params
  LeagueModel.deleteOne({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.satus(501).send({ message: 'No se ha podido borrar la liga ', error }))
}

module.exports = { createLeague, getLeagues, getLeague, updateLeague, deleteLeague }
