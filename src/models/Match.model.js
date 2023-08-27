const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MatchModel = new Schema({
    date: {
        type: String,
    },
    local: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Team',
        require: [true, 'Este campo es equerido'],
    },
    away: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Team',
        require: [true, 'Este campo es equerido'],
    },
    lineup: [
        {
            local: [
                {
                    playerId: {
                        type: mongoose.SchemaTypes.ObjectId,
                        ref: 'Player',
                    },
                },
            ],
            away: [
                {
                    playerId: {
                        type: mongoose.SchemaTypes.ObjectId,
                        ref: 'Player',
                    },
                },
            ],
        },
    ],
    score: [
        {
            local: {
                type: Number,
            },
            away: {
                type: Number,
            },
        },
    ],
    round: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Round',
        required: [true, 'Este campo es requerido'],
    },
    season: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Season',
        required: [true, 'Este campo es requerido'],
    },
    league: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'League',
        required: [true, 'Este campo es requerido'],
    },
    sport: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Sport',
        required: [true, 'Este campo es requerido'],
    },
    status: {
        type: Boolean,
    },
    comments: [
        {
            username: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Bookie',
            },
            comment: {
                type: String,
            },
            hour: {
                type: String,
            },
        },
    ],
    votes: [
        {
            username: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Bookie',
            },
            option: {
                type: String,
            },
        },
    ],
    oddHome: String,
    oddAway: String,
    oddDraw: String,
    oddOverUnder: String,
    moreImportant: Boolean,
})

module.exports = mongoose.model('Match', MatchModel)
