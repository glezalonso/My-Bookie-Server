const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SeasonModel = new Schema({
  season: {
    type: String,
    required: [true, 'Este campo es obligatorio']
  },
  description: {
    type: String
  },
  status: {
    type: Boolean
  },
  league: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'League',
    required: [true, 'La temporada debe pertenecer a una liga']
  }
})

module.exports = mongoose.model('Season', SeasonModel)
