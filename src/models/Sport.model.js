const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sportSchema = new Schema({
  sport: {
    type: String,
    require: [true, 'Este campo no puede estar vacio'],
    unique: [true, 'Este deporte ya existe']
  },
  description: {
    type: String
  },
  poster: {
    type: String
  }
})

module.exports = mongoose.model('Sport', sportSchema)
