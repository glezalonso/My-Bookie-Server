const MatchModel = require('../models/Match.model')

const getMatches = (req, res) => {
  MatchModel.find({}).populate('round teams.local teams.away teams.local.players lineup.away', { __v: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al mostrarlos juegos', error }))
}
const getMatch = (req, res) => {
  const { id } = req.params
  MatchModel.findOne({ _id: id }).populate('round teams.local teams.away teams.local.players', { __v: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al mostar los juegos' }, error))
}

const createMatch = (req, res) => {
  const { date, teamHome, teamAway, round, status } = req.body
  const newMatch = new MatchModel({
    date,
    teams: { local: teamHome, away: teamAway },
    round,
    status
  })
  newMatch.save()
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al crear el juego, error' }, error))
}

const updateMatch = (req, res) => {
  const { id } = req.params
  const { date, teamHome, teamAway, round, status } = req.body
  MatchModel.findOneAndUpdate({ _id: id }, {
    date,
    teams: { local: teamHome, away: teamAway },
    round,
    status
  }, { new: true })
    .then(data => res.status(201).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al actualizar el juego', error }))
}

const deleteMatch = (req, res) => {
  const { id } = req.params
  MatchModel.findOneAndDelete({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Ha ocurrido un error al intentar borrar el juego', error }))
}

const closeMatch = (req, res) => {
  const { id } = req.params
  const { local, away } = req.body
  MatchModel.findOneAndUpdate({ _id: id }, { score: { local, away }, status: false }, { new: true })
    .then(data => res.status(210).send(data))
    .catch()
}

const addLineUp = (req, res) => {
  const { id } = req.params
  const { playerId, player, type } = req.body
  if (type === 'local') {
    MatchModel.findOneAndUpdate({ _id: id }, { $push: { lineup: { local: { playerId, player } } } }, { new: true })
      .then(data => {
        res.send(data)
      })
      .catch()
  } else {
    MatchModel.findOneAndUpdate({ _id: id }, { $push: { lineup: { away: { playerId, player } } } }, { new: true })
      .then(data => {
        res.send(data)
      })
      .catch()
  }
}

const removeLineUp = (req, res) => {
  const { id } = req.params
  const { playerId, player, lineId, type } = req.body
  console.log(req.body)
  if (type === 'local') {
    MatchModel.findOneAndUpdate({ _id: id }, { $pull: { lineup: { local: { playerId, player, _id: lineId } } } }, { new: true })
      .then(data => {
        res.send(data)
      })
      .catch()
  } else {
    MatchModel.findOneAndUpdate({ _id: id }, { $pull: { lineup: { away: { playerId, player, _id: lineId } } } }, { new: true })
      .then(data => {
        res.send(data)
      })
      .catch()
  }
}

module.exports = { getMatches, getMatch, createMatch, updateMatch, deleteMatch, addLineUp, removeLineUp, closeMatch }
