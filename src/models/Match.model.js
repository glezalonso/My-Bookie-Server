const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MatchModel = new Schema({
  date: {
    type: Date,
    require: [true, 'Este campo es requerido']
  },
  local: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Team',
    require: [true, 'Este campo es equerido']
  },
  away: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Team',
    require: [true, 'Este campo es equerido']
  },
  lineup: [{
    local: [{
      playerId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Player'
      },
      player: {
        type: String
      }
    }],
    away: [{
      playerId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Player'
      },
      player: {
        type: String
      }
    }]

  }],
  score: [{
    local: {
      type: Number
    },
    away: {
      type: Number
    }
  }],
  round: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Round',
    required: [true, 'Este campo es requerido']
  },
  status: {
    type: Boolean
  }
})

module.exports = mongoose.model('Match', MatchModel)
