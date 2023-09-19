const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TournamentModel = new Schema({
    league: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'League',
        required: [true, 'Este campo es requerido'],
    },
    season: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Season',
        required: [true, 'Este campo es requerido'],
    },
    status: {
        type: Boolean,
        required: [true, 'Este campo es requerido'],
    },
    minimum: {
        type: Number,
        required: [true, 'Este campo es requerido'],
    },
    bookie: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Bookie',
    },
    votes: {
        type: Number,
    },
    success: {
        type: Number,
    },
})

module.exports = mongoose.model('Tournament', TournamentModel)
