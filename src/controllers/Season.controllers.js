const SeasonModel = require('../models/Season.model')
const TeamModel = require('../models/Team.model')
const ObjectId = require('mongoose').Types.ObjectId

const getSeasons = (req, res) => {
  SeasonModel.find({}).populate('league sport standings.team')
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al mostrar las temporadas 1', error }))
}

const getSeason = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    SeasonModel.findOne({ _id: id }).populate('league sport standings.team')
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al mostar las temporadas 2', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const createSeason = (req, res) => {
  const { season, description, status, league, sport } = req.body
  const newSeason = new SeasonModel({
    season,
    description,
    status,
    league,
    sport
  })
  newSeason.save()
    .then(data => res.status(200).json(data))
    .catch(error => {
      console.log(error)
      res.status(501).json({ message: 'Ha ocurrido un error al crear la temporada', error })
    })
}

const updateSeason = (req, res) => {
  const { id } = req.params
  const { season, description, status, league, sport } = req.body
  if (ObjectId.isValid(id)) {
    SeasonModel.findOneAndUpdate({ _id: id }, {
      season,
      description,
      status,
      league,
      sport
    }, { new: true })
      .then(data => res.status(201).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al actualizar la temporada', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const deleteSeason = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    SeasonModel.findOneAndDelete({ _id: id })
      .then((data) => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al intentar borrar la temporada', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const addTeam = (req, res) => {
  const { id } = req.params
  const { team } = req.body
  if (ObjectId.isValid(id)) {
    SeasonModel.findOneAndUpdate({ _id: id }, { $push: { standings: { team, wins: 0, draws: 0, loses: 0 } } }, { new: true })
      .then(() => {
        TeamModel.findOneAndUpdate({ _id: team }, { $push: { seasons: { season: id } } })
          .then((data) => res.status(200).json(data))
          .catch(error => res.status(505).json({ message: 'Hubo un error al agregar el equipo', error }))
      })
      .catch(error => res.status(505).json({ message: 'Hubo un error al agregar el equipo', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}
const removeTeam = (req, res) => {
  const { id } = req.params
  const { team } = req.body
  console.log(team)
  if (ObjectId.isValid(id)) {
    SeasonModel.findOneAndUpdate({ _id: id }, { $pull: { standings: { _id: team } } }, { new: true })
      .then(() => {
        TeamModel.findOneAndUpdate({ _id: team }, { $pull: { seasons: { season: id } } })
          .then((data) => res.status(200).json(data))
          .catch(error => res.status(505).json({ message: 'Hubo un error al agregar el equipo', error }))
      })
      .catch(error => res.status(505).json({ message: 'Hubo un error al agregar el equipo', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

module.exports = { getSeasons, getSeason, createSeason, updateSeason, deleteSeason, addTeam, removeTeam }
