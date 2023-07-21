const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newSchema = new Schema({
    sport: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Sport',
        require: [true, 'la noticia debe estar relacionada a un deporte'],
    },
    title: {
        type: String,
        require: [true, 'la noticia debe tener un titulo'],
    },
    date: {
        type: String,
        require: [true, ' la noticia debe tener una fecha de creacion'],
    },
    content: {
        type: String,
        retuire: [true, 'La noticia debe tener contenido'],
    },
    author: {
        type: String,
        require: [true, 'La noticia debe tener un autor'],
    },
})

module.exports = mongoose.model('new', newSchema)
