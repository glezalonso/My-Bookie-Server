
const RoundModel = require('../models/Round.model')
const ObjectId = require('mongoose').Types.ObjectId

const getRounds = (req, res) => {
  RoundModel.find().populate('season league sport')
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'No hay deportes para mostar ', error }))
}

const getRound = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    RoundModel.findOne({ _id: id }).populate('season league sport')
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'No hay deportes que mostar ', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const createRound = (req, res) => {
  const { round, roundNumber, season, status, league, sport } = req.body
  const newRound = new RoundModel({
    round,
    roundNumber,
    season,
    status,
    league,
    sport
  })
  newRound.save()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'No se ha podido crear la jornada ', error }))
}

const updateRound = (req, res) => {
  const { id } = req.params
  const { round, roundNumber, season, status, league, sport } = req.body
  if (ObjectId.isValid(id)) {
    RoundModel.findOneAndUpdate({ _id: id }, {
      round,
      roundNumber,
      season,
      status,
      league,
      sport
    }, { new: true })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'No se ha podido actualizarla jornada ', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const deleteRound = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    RoundModel.deleteOne({ _id: id })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'No se ha podido borrar la jornada', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

module.exports =
  {
    createRound,
    getRounds,
    getRound,
    updateRound,
    deleteRound

  }
