const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TournamentModel = new Schema({
    season: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Season',
        required: [true, 'Este campo es requerido'],
    },
    status: {
        type: Boolean,
        required: [true, 'Este campo es requerido'],
    },
})

module.exports = mongoose.model('Tournament', TournamentModel)
