const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamModel = new Schema({
    name: {
        type: String,
        required: [true, 'Este campo es requerido'],
        unique: [true, 'Este equipo ya existe'],
    },
    poster: {
        type: String,
    },
    stadium: {
        type: String,
    },
    status: {
        type: Boolean,
    },
    players: [
        {
            playerId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Player',
            },
        },
    ],
    sport: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Sport',
    },
    seasons: [
        {
            season: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Season',
            },
        },
    ],
})

module.exports = mongoose.model('Team', TeamModel)
