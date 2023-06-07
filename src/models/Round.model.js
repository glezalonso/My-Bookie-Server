const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoundModel = new Schema({
  round: {
    type: String,
    required: [true, 'Este campo es obligatorio']
  },
  roundNumber: {
    type: Number,
    required: [true, 'Este campo es requerido']
  },
  season: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Season',
    require: [true, 'La jornada debe pertenecer a una temporada']
  },
  matches: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Match'
  }
  ],
  status: {
    type: Boolean
  }

})
module.exports = mongoose.model('Round', RoundModel)
