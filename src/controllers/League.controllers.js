const LeagueModel = require('../models/League.model')
const ObjectId = require('mongoose').Types.ObjectId

const getLeagues = (req, res) => {
  LeagueModel.find().populate('sport', { __v: 0, status: 0 })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'No hay ligas para mostrar ', error }))
}

const getLeague = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    LeagueModel.findOne({ _id: id }).populate('sport', { __v: 0, status: 0 })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'No hay ligas para mostrar', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
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
    .then(data => res.status(201).json(data))
    .catch(error => res.status(501).json({ message: 'Hubo un error al crear la liga ', error }))
}

const updateLeague = async (req, res) => {
  const { id } = req.params
  const { league, description, sport, poster } = req.body
  if (ObjectId.isValid(id)) {
    await LeagueModel.findOneAndUpdate({ _id: id }, {
      league,
      description,
      poster,
      sport
    }, { new: true })
      .then(data => res.status(201).json(data))
      .catch(error => res.status(501).json({ message: 'No se podido actualizar la liga ', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const deleteLeague = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    LeagueModel.deleteOne({ _id: id })
      .then(data => res.status(200).json(data))
      .catch(error => res.satus(501).json({ message: 'No se ha podido borrar la liga ', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

module.exports = { createLeague, getLeagues, getLeague, updateLeague, deleteLeague }
