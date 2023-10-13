const mongoose = require('mongoose')
const Schema = mongoose.Schema

const forumSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Bookie',
        require: [true, 'Campo requerido'],
    },
    message: {
        type: String,
        require: [true, 'Campo requerido'],
    },
    date: {
        type: String,
        require: [true, 'Campo requerido'],
    },
    images: [
        {
            type: String,
        },
    ],
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
})

module.exports = mongoose.model('Forum', forumSchema)
