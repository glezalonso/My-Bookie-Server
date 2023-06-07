const MatchModel = require('../models/Match.model')
const RoundModel = require('../models/Round.model')

const getRounds = (req, res) => {
  RoundModel.find().populate('season', { __v: 0, status: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No hay deportes para mostar ', error }))
}

const getRound = (req, res) => {
  const { id } = req.params
  RoundModel.findOne({ _id: id }).populate('season season.league', { __v: 0, status: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No hay deportes que mostar ', error }))
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
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No se ha podido crear la jornada ', error }))
}

const updateRound = (req, res) => {
  const { id } = req.params
  const { round, roundNumber, season, status } = req.body
  RoundModel.findOneAndUpdate({ _id: id }, {
    round,
    roundNumber,
    season,
    status
  }, { new: true })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No se ha podido actualizarla jornada ', error }))
}

const deleteRound = (req, res) => {
  const { id } = req.params
  RoundModel.deleteOne({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No se ha podido borrar la jornada', error }))
}

const addMatch = (req, res) => {
  const { id } = req.params
  const { matchId } = req.body
  MatchModel.findOneAndUpdate({ _id: id }, { $push: { matches: matchId } }, { new: true }).populate('match', { __v: 0 }).populate('league', { __v: 0 })
    .then(data => res.send(data))
    .catch()
}

const removeMatch = (req, res) => {
  const { id } = req.params
  const { matchId } = req.body
  console.log(req.body)
  MatchModel.findOneAndUpdate({ _id: id }, { $pull: { matches: matchId } }, { new: true }).populate('match', { __v: 0 }).populate('league', { __v: 0 })
    .then(data => res.send(data))
    .catch()
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
