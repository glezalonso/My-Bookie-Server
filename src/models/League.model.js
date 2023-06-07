const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leagueSchema = new Schema({
  league: {
    type: String,
    require: [true, 'Este campo no puede ir vacio'],
    unique: [true, 'esta liga ya existe']
  },
  description: {
    type: String
  },
  poster: {
    type: String
  },
  sport: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Sport',
    require: [true, 'La liga debe pertenecer a un deporte']
  }
})

module.exports = mongoose.model('League', leagueSchema)
