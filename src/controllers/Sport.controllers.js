const SportModel = require('../models/Sport.model')

const getSports = (req, res) => {
  SportModel.find()
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No hay deportes para mostar ', error }))
}

const getSport = (req, res) => {
  const { id } = req.params
  SportModel.findOne({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No hay deportes que mostar ', error }))
}

const createSport = (req, res) => {
  const { sport, description, poster } = req.body
  const newSport = new SportModel({
    sport,
    description,
    poster
  })
  newSport.save()
    .then(data => res.status(201).send(data.sport))
    .catch(error => res.status(501).send({ message: 'No se ha podido crear el deporte ', error }))
}

const updateSport = (req, res) => {
  const { id } = req.params
  const { sport, description, poster } = req.body
  SportModel.findOneAndUpdate({ _id: id }, {
    sport,
    description,
    poster
  }, { new: true })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No se ha podido actualizar el deporte ', error }))
}

const deleteSport = (req, res) => {
  const { id } = req.params
  SportModel.deleteOne({ _id: id })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'No se ha podido borrar el deporte', error }))
}

module.exports =
{
  createSport,
  getSports,
  getSport,
  updateSport,
  deleteSport
}
