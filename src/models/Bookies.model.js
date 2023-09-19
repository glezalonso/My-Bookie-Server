const { Schema, default: mongoose } = require('mongoose')

const bookieSchema = new Schema({
    fullName: {
        type: String,
        require: [true, 'This field is required'],
    },
    username: {
        type: String,
        require: [true, 'This field is required'],
        unique: true,
    },
    email: {
        type: String,
        require: [true, 'This field is required'],
        unique: true,
    },
    password: {
        type: String,
        require: [true, 'This field is required'],
    },
    avatar: String,
    OTP: String,
    votes: [
        {
            match: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Match',
            },
            option: String,
        },
    ],
    followers: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Bookie',
        },
    ],

    follow: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Bookie',
        },
    ],
    total: {
        type: Number,
    },
    success: {
        type: Number,
    },
    failures: {
        type: Number,
    },
    matchesSuccess: [
        {
            match: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Match',
            },
            sport: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Sport',
            },
            round: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Round',
            },
            season: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Season',
            },
            league: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'League',
            },
            date: {
                type: String,
            },
        },
    ],
    matchesFailure: [
        {
            match: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Match',
            },
            sport: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Sport',
            },
            round: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Round',
            },
            season: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Season',
            },
            league: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'League',
            },
            date: {
                type: String,
            },
        },
    ],
    tournaments: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Tournament',
        },
    ],
})

module.exports = mongoose.model('Bookie', bookieSchema)
