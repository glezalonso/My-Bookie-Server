const BookiesModel = require('../models/Bookies.model')
const ForumModel = require('../models/Forum.model')
const ObjectId = require('mongoose').Types.ObjectId
const { upload, remove } = require('../libs/cloudinary')
const fs = require('fs/promises')

const getMessages = (req, res) => {
    ForumModel.find({})
        .populate('user comments.username')
        .sort({ date: 'desc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(500)
                .json(
                    { message: 'Ha ocurrido un error al mostar los mensaje' },
                    error
                )
        )
}

const getMessage = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(500).json({ messaje: 'Error en la petición' })

    ForumModel.findOne({ _id: id })
        .populate('user comments.username')
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Hubo un error al consultar el mensaje',
                error,
            })
        )
}

const createMessage = async (req, res) => {
    const { user, message, date } = req.body

    if (req.files) {
        const { image } = req.files
        try {
            const { secure_url, public_id } = await upload(image.tempFilePath)
            const newMessage = new ForumModel({
                user,
                message,
                date,
                images: { public_id, secure_url },
            })
            newMessage
                .save()
                .then(async (data) => {
                    await BookiesModel.findOneAndUpdate(
                        { _id: user },
                        { $push: { messages: data._id } }
                    )
                    await fs.unlink(image.tempFilePath)
                    res.status(200).json(data)
                })
                .catch((error) =>
                    res.status(500).json({
                        message: ' Hubo un error al crear el mensaje',
                        error,
                    })
                )
        } catch (error) {
            res.status(500).json({
                message: ' Hubo un error al crear el mensaje',
                error,
            })
        }
    } else {
        const newMessage = new ForumModel({
            user,
            message,
            date,
        })
        newMessage
            .save()
            .then(async (data) => {
                await BookiesModel.findOneAndUpdate(
                    { _id: user },
                    { $push: { messages: data._id } }
                )
                res.status(200).json(data)
            })
            .catch((error) =>
                res.status(500).json({
                    message: ' Hubo un error al crear el mensaje',
                    error,
                })
            )
    }
}

const updateMessage = (req, res) => {
    const { id } = req.params
    const { user, message, date, images } = req.body
    if (!ObjectId.isValid(id))
        return res.status(500).json({ message: 'Error en la petición' })

    ForumModel.findOneAndUpdate(
        { _id: id },
        { user, message, date, images },
        { new: true }
    )
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Hubo un error al actualizar el mensaje',
                error,
            })
        )
}

const deleteMessage = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(500).json({ message: 'Error en la petición' })
    ForumModel.findOneAndDelete({ _id: id })
        .then(async (data) => {
            await remove(data.images.public_id)
            res.status(200).json({ message: 'Se ha borrado con exito' })
        })
        .catch((error) =>
            res.status(500).json({
                message: 'Hubo un error al eliminar el mensaje',
                error,
            })
        )
}

const addComment = (req, res) => {
    const { id } = req.params
    const { username, comment, hour } = req.body

    if (!ObjectId.isValid(id))
        return res.status(500).json({ messaje: 'Error en la petición' })
    ForumModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { username, comment, hour } } },
        { new: true }
    )
        .then(() =>
            res
                .status(202)
                .json({ message: 'Se ha agregado comentario exitosamente' })
        )
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al agregar el post',
                error,
            })
        )
}

const removeComment = (req, res) => {
    const { id } = req.params
    const { userId, comment, hour, commentId } = req.body
    console.log(req.body)
    if (!ObjectId.isValid(id))
        return res.status(500).json({ message: 'Error en la petición' })
    ForumModel.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                comments: { username: userId, hour, comment, _id: commentId },
            },
        },
        { new: true }
    )
        .then(() =>
            res
                .status(202)
                .json({ message: 'Se ha borrado comentario exitosamente' })
        )
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al borrar el post',
                error,
            })
        )
}

module.exports = {
    getMessage,
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    addComment,
    removeComment,
}
