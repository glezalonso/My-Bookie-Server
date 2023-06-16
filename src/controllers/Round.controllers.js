const MatchModel = require('../models/Match.model')
const RoundModel = require('../models/Round.model')
const ObjectId = require('mongoose').Types.ObjectId

const getRounds = (req, res) => {
  RoundModel.find().populate('season', { __v: 0, status: 0 })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'No hay deportes para mostar ', error }))
}

const getRound = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    RoundModel.findOne({ _id: id }).populate('season season.league', { __v: 0, status: 0 })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'No hay deportes que mostar ', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const createRound = (req, res) => {
  const { round, roundNumber, season, status } = req.body
  const newRound = new RoundModel({
    round,
    roundNumber,
    season,
    status
  })
  newRound.save()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'No se ha podido crear la jornada ', error }))
}

const updateRound = (req, res) => {
  const { id } = req.params
  const { round, roundNumber, season, status } = req.body
  if (ObjectId.isValid(id)) {
    RoundModel.findOneAndUpdate({ _id: id }, {
      round,
      roundNumber,
      season,
      status
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

const addMatch = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    const { matchId } = req.body
    MatchModel.findOneAndUpdate({ _id: id }, { $push: { matches: matchId } }, { new: true }).populate('match', { __v: 0 }).populate('league', { __v: 0 })
      .then(data => res.status(201).json(data))
      .catch(error => res.status(501).json({ message: 'No se ha podido agregar el partido a la jornada', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const removeMatch = (req, res) => {
  const { id } = req.params
  const { matchId } = req.body
  if (ObjectId.isValid(id)) {
    console.log(req.body)
    MatchModel.findOneAndUpdate({ _id: id }, { $pull: { matches: matchId } }, { new: true }).populate('match', { __v: 0 }).populate('league', { __v: 0 })
      .then(data => res.status(201).json(data))
      .catch(error => res.status(501).json({ message: 'No se ha podido remover el partido a la jornada', error }))
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
    deleteRound,
    addMatch,
    removeMatch
  }
