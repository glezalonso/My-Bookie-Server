const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MatchModel = new Schema({
  date: {
    type: Date,
    require: [true, 'Este campo es requerido']
  },
  teams: [{
    local: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Team',
      require: [true, 'Este campo es equerido']
    },
    away: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Team',
      require: [true, 'Este campo es equerido']
    }

  }],
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
    local: [{
      first: {
        type: Number
      },
      second: {
        type: Number
      },
      third: {
        type: Number
      },
      fourth: {
        type: Number
      }
    }],
    away: [{
      first: {
        type: Number
      },
      second: {
        type: Number
      },
      third: {
        type: Number
      },
      fourth: {
        type: Number
      }
    }]
  }],
  winner: {
    type: String
  },
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
