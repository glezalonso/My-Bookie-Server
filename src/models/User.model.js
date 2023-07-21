const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Proporcionar un nombre de usuario'],
        unique: [true, 'El nombre de usuario ya existe'],
    },
    password: {
        type: String,
        required: [true, 'Proporcionar un contraseña'],
        unique: false,
    },
    email: {
        type: String,
        required: [true, 'Proporcionar un correo electronico'],
        unique: true,
    },
    fullName: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
    },
    OTP: {
        type: String,
    },
})

module.exports = mongoose.model('User', userSchema)
