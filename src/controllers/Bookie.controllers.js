const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const BookieModel = require('../models/Bookies.model')
const ObjectId = require('mongoose').Types.ObjectId

const register = async (req, res) => {
    const { fullName, username, email, password } = req.body

    try {
        const exitEmail = await BookieModel.findOne({ email })
        if (exitEmail)
            return res.status(501).json({ error: 'Email already exist' })

        const exitUsername = await BookieModel.findOne({ username })
        if (exitUsername)
            return res.status(501).json({ error: 'username already exist' })

        const passwordHash = await bcrypt.hash(password, 10)

        const registerBookie = new BookieModel({
            fullName,
            username,
            email,
            password: passwordHash,
        })
        registerBookie.save()
        if (!registerBookie)
            return res.status(501).json({ error: 'There was an error' })
        const token = jwt.sign(
            { username: registerBookie.username },
            process.env.SECURITY_BOOKIE,
            { expiresIn: '24h' }
        )

        res.status(201).json({ username: registerBookie.username, token })
    } catch (error) {
        return res.status(501).json({ error: 'There was an error' })
    }
}

const loginBookie = async (req, res) => {
    const { username, password } = req.body
    try {
        const existBookie = await BookieModel.findOne({ username })
        if (!existBookie)
            return res.status(501).json({ error: 'Wrong Credentials' })

        const verifyPass = await bcrypt.compare(password, existBookie.password)
        if (!verifyPass)
            return res.status(501).json({ error: 'Wrong Credentials' })

        const token = jwt.sign(
            { username: existBookie.username },
            process.env.SECURITY_BOOKIE,
            { expiresIn: '24h' }
        )
        res.status(201).json({ username: existBookie.username, token })
    } catch (error) {
        return res.status(501).json({ error: 'There was an error' })
    }
}

const getBookies = (req, res) => {
    BookieModel.find({})
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al mostar los bookies',
                error,
            })
        )
}

const getBookie = (req, res) => {
    const { id } = req.params
    if (ObjectId.isValid(id)) {
        BookieModel.findOne({ _id: id })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(500).json({
                    message: 'Ha ocurrido un error al mostar los bookies',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const updateBookie = async (req, res) => {
    const { id } = req.params
    const { fullName, username, email, password } = req.body
    console.log(req.body)
    if (ObjectId.isValid(id)) {
        const passwordHash = await bcrypt.hash(password, 10)
        BookieModel.findOneAndUpdate(
            { _id: id },
            {
                fullName,
                username,
                email,
                password: passwordHash,
            },
            { new: true }
        )
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(500).json({
                    message: 'Ha ocurrido un error al actualizar los bookies',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}
const deleteBookie = (req, res) => {
    const { id } = req.params
    if (ObjectId.isValid(id)) {
        BookieModel.findOneAndDelete({ _id: id })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(500).json({
                    message: 'Hubo un error al borrar el Bookie',
                    error,
                })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

module.exports = {
    loginBookie,
    register,
    getBookies,
    getBookie,
    updateBookie,
    deleteBookie,
}
