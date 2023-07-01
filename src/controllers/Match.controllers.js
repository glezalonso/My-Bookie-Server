const MatchModel = require('../models/Match.model')
const ObjectId = require('mongoose').Types.ObjectId

const getMatches = (req, res) => {
  MatchModel.find({}).populate('round season league local away sport', { __v: 0 }).sort({ date: 'asc' })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al mostrarlos juegos', error }))
}
const getMatch = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    MatchModel.findOne({ _id: id }).populate('round season league local away sport lineup.local.playerId lineup.away.playerId', { __v: 0 }).sort({ date: 'asc' })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al mostar los juegos', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const createMatch = (req, res) => {
  const { date, teamHome, teamAway, round, season, league, sport, status } = req.body
  const newMatch = new MatchModel({
    date,
    local: teamHome,
    away: teamAway,
    round,
    season,
    league,
    sport,
    status
  })
  newMatch.save()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al crear el juego, error', error }))
}

const updateMatch = (req, res) => {
  const { id } = req.params
  const { date, teamHome, teamAway, round, season, league, status, sport } = req.body
  if (ObjectId.isValid(id)) {
    MatchModel.findOneAndUpdate({ _id: id }, {
      date,
      local: teamHome,
      away: teamAway,
      round,
      season,
      league,
      sport,
      status
    }, { new: true })
      .then(data => res.status(201).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al actualizar el juego', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const deleteMatch = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    MatchModel.findOneAndDelete({ _id: id })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al intentar borrar el juego', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const closeMatch = (req, res) => {
  const { id } = req.params
  const { local, away } = req.body
  if (ObjectId.isValid(id)) {
    MatchModel.findOneAndUpdate({ _id: id }, { score: { local, away }, status: false }, { new: true })
      .then(data => res.status(210).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al cerrar el juego', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const addLineUp = (req, res) => {
  const { id } = req.params
  const { playerId, type } = req.body
  if (ObjectId.isValid(id)) {
    if (type === 'local') {
      MatchModel.findOneAndUpdate({ _id: id }, { $push: { lineup: { local: { playerId } } } }, { new: true })
        .then(data => res.status(201).json(data))
        .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al agregar el jugador a la alineación local', error }))
    } else {
      MatchModel.findOneAndUpdate({ _id: id }, { $push: { lineup: { away: { playerId } } } }, { new: true })
        .then(data => res.status(201).json(data))
        .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al agregar el jugador a la alineación visitante', error }))
    }
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const removeLineUp = (req, res) => {
  const { id } = req.params
  const { playerId, lineId, type } = req.body
  console.log(req.body)
  if (ObjectId.isValid(id)) {
    if (type === 'local') {
      MatchModel.findOneAndUpdate({ _id: id }, { $pull: { lineup: { local: { playerId, _id: lineId } } } }, { new: true })
        .then(data => res.status(201).json(data))
        .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al remover el jugador a la alineación visitante', error }))
    } else {
      MatchModel.findOneAndUpdate({ _id: id }, { $pull: { lineup: { away: { playerId, _id: lineId } } } }, { new: true })
        .then(data => res.status(201).json(data))
        .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al remover el jugador a la alineación visitante', error }))
    }
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const addComment = (req, res) => {
  const { id } = req.params
  const { username, comment } = req.body

  if (ObjectId.isValid(id)) {
    MatchModel.findOneAndUpdate({ _id: id }, { $push: { comments: { username, comment } } }, { new: true })
      .then(() => res.status(202).json({ message: 'Se ha agregado comentario exitosamente' }))
      .catch(error => res.status(500).json({ message: 'Ha ocurrido un error al agregar el post', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const removeComment = (req, res) => {
  const { id } = req.params
  const { username, comment, commentId } = req.body

  if (ObjectId.isValid(id)) {
    MatchModel.findOneAndUpdate({ _id: id }, { $pull: { comments: { username, comment, _id: commentId } } }, { new: true })
      .then(() => res.status(202).json({ message: 'Se ha borrado comentario exitosamente' }))
      .catch(error => res.status(500).json({ message: 'Ha ocurrido un error al borrar el post', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

module.exports = { getMatches, getMatch, createMatch, updateMatch, deleteMatch, addLineUp, removeLineUp, closeMatch, addComment, removeComment }
