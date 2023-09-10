const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TournamentModel = new Schema({
    league: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Este campo es requerido'],
    },
    status: {
        type: Boolean,
        required: [true, 'Este campo es requerido'],
    },
})

module.exports = mongoose.model('Tournament', TournamentModel)
