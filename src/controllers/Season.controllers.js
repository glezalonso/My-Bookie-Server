const SeasonModel = require('../models/Season.model')
const ObjectId = require('mongoose').Types.ObjectId

const getSeasons = (req, res) => {
  SeasonModel.find({}).populate('league')
    .then(data => res.status(200).json(data))
    .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al mostrar las temporadas 1', error }))
}

const getSeason = (req, res) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    SeasonModel.findOne({ _id: id }).populate('league')
      .then(data => res.status(200).json(data))
      .catch(error => res.status(501).json({ message: 'Ha ocurrido un error al mostar las temporadas 2', error }))
  } else {
    res.status(501).json({ messsage: 'Ha ocurrido un error en la peticion' })
  }
}

const createSeason = (req, res) => {
  const { season, description, status, league } = req.body
  const newSeason = new SeasonModel({
    season,
    description,
    status,
    league
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
  const { season, description, status, league } = req.body
  if (ObjectId.isValid(id)) {
    SeasonModel.findOneAndUpdate({ _id: id }, {
      season,
      description,
      status,
      league
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

module.exports = { getSeasons, getSeason, createSeason, updateSeason, deleteSeason }
