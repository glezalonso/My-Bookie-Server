const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User.model')
const ObjectId = require('mongoose').Types.ObjectId

const getUsers = (req, res) => {
    UserModel.find()
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Hubo un error al cargar los usuarios',
                error,
            })
        )
}

const getUser = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })
    UserModel.findById(id)
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(501).json({
                message: 'Hubo un error al cargar los usuarios!',
                error,
            })
        )
}

const loginUser = async (req, res) => {
    const { username, password } = req.body
    const existUser = await UserModel.findOne({ username })
    if (!existUser)
        return res
            .status(404)
            .json({ message: 'Usuario y/o contraseña no valida' })
    bcrypt
        .compare(password, existUser.password)
        .then((data) => {
            if (!data) {
                res.status(501).json({
                    message: 'Usuario y/o contraseña no valida',
                })
            } else {
                const token = jwt.sign(
                    { userId: existUser._id, username: existUser.username },
                    process.env.SECURITY_BOOKIE,
                    { expiresIn: '7d' }
                )
                res.status(201).json({
                    token,
                    username: existUser.username,
                    isAdmin: existUser.isAdmin,
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(501).json({
                message: 'hubo un error al iniciar sesión 2',
                error,
            })
        })
}

const registerUser = async (req, res) => {
    const { username, password, email, fullName, isAdmin } = req.body
    try {
        const existUser = await UserModel.findOne({ username })
        if (existUser)
            return res.status(404).json({ message: 'Usuario ya existe!' })

        const existEmail = await UserModel.findOne({ email })
        if (existEmail)
            return res.status(404).json({ message: 'email ya existe!' })

        const passCrypt = await bcrypt.hash(password, 10)
        const registerUser = new UserModel({
            username,
            password: passCrypt,
            email,
            fullName,
            isAdmin,
        })
        registerUser
            .save()
            .then((data) => {
                return res.status(201).json(data.username)
            })
            .catch((error) => {
                return res.status(501).json({
                    message: 'Ha ocurrido un error al registar el usuario',
                    error,
                })
            })
    } catch (error) {
        return res.status(501).json({
            message: 'Ha ocurrido un error al registar el usuario',
            error,
        })
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })
    const { username, password, email, fullName, isAdmin } = req.body
    try {
        const passCrypt = await bcrypt.hash(password, 10)
        await UserModel.findOneAndUpdate(
            { _id: id },
            {
                username,
                password: passCrypt,
                email,
                fullName,
                isAdmin,
            },
            { new: true }
        )
            .then((data) => res.status(201).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'No se ha podido actualizar el usuario',
                    error,
                })
            )
    } catch (error) {
        return res.status(501).json({
            message: 'No se ha podido actualizar el usuario ',
            error,
        })
    }
}

const deleteUser = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({ message: 'Hubo un error en la petición' })

    UserModel.deleteOne({ _id: id })
        .then(() =>
            res
                .status(201)
                .json({ message: 'El usuario se ha borrado exitosamente!' })
        )
        .catch((error) =>
            res.status(505).json({
                message: 'Hubo un error al intentar borrar el usuario ',
                error,
            })
        )
}

module.exports = {
    getUsers,
    getUser,
    loginUser,
    registerUser,
    updateUser,
    deleteUser,
}
