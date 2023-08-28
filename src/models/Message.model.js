const { Schema, default: mongoose } = require('mongoose')

const messageSchema = new Schema({
    email: {
        type: String,
        require: [true, ' this field is required'],
    },
    subject: {
        type: String,
        require: [true, ' this field is required'],
    },
    content: {
        type: String,
        require: [true, ' this field is required'],
    },
})

module.exports = mongoose.model('Message', messageSchema)
