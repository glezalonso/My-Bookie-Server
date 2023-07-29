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
})

module.exports = mongoose.model('Bookie', bookieSchema)
