const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayerModel = new Schema({
    fullName: {
        type: String,
        required: [true, 'Proporcionar un nombre de usuario'],
    },
    photo: {
        type: String,
    },
    position: {
        type: String,
    },
    status: {
        type: Boolean,
    },
    sport: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Sport',
        require: [true, 'El jugador debe pertenecer a un deporte'],
    },
    team: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Team',
    },
})

module.exports = mongoose.model('Player', PlayerModel)
