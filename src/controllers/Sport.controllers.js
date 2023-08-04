const SportModel = require('../models/Sport.model')
const ObjectId = require('mongoose').Types.ObjectId
const { upload } = require('../libs/cloudinary')

const getSports = (req, res) => {
    SportModel.find()
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(501)
                .json({ message: 'No hay deportes para mostar ', error })
        )
}

const getSport = (req, res) => {
    const { id } = req.params
    if (ObjectId.isValid(id)) {
        SportModel.findOne({ _id: id })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res
                    .status(501)
                    .json({ message: 'No hay deportes que mostar ', error })
            )
    } else {
        res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    }
}

const createSport = async (req, res) => {
    const { sport, description } = req.body

    if (req.files) {
        const { poster } = req.files
        try {
            const { secure_url } = await upload(poster.tempFilePath)
            const newSport = new SportModel({
                sport,
                description,
                poster: secure_url,
            })
            newSport
                .save()
                .then((data) => res.status(201).json(data.sport))
                .catch((error) =>
                    res.status(501).json({
                        message: 'No se ha podido crear el deporte ',
                        error,
                    })
                )
        } catch (error) {
            res.status(501).json({
                message: 'No se ha podido crear el deporte ',
                error,
            })
        }
    } else {
        const newSport = new SportModel({
            sport,
            description,
        })
        newSport
            .save()
            .then((data) => res.status(201).json(data.sport))
            .catch((error) =>
                res.status(501).json({
                    message: 'No se ha podido crear el deporte ',
                    error,
                })
            )
    }
}

const updateSport = async (req, res) => {
    const { id } = req.params
    const { sport, description } = req.body
    if (req.files) {
        const { poster } = req.files
        try {
            const { secure_url } = await upload(poster.tempFilePath)
            SportModel.findOneAndUpdate(
                { _id: id },
                {
                    sport,
                    description,
                    poster: secure_url,
                },
                { new: true }
            ).then((data) => res.status(200).json(data))
        } catch (error) {
            res.status(501).json({
                message: 'No se ha podido crear el deporte ',
                error,
            })
        }
    } else {
        SportModel.findOneAndUpdate(
            { _id: id },
            {
                sport,
                description,
            },
            { new: true }
        )
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'No se ha podido actualizar el deporte ',
                    error,
                })
            )
    }
}

const deleteSport = (req, res) => {
    const { id } = req.params
    if (ObjectId.isValid(id)) {
        SportModel.deleteOne({ _id: id })
            .then((data) => res.status(200).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'No se ha podido borrar el deporte',
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
    createSport,
    getSports,
    getSport,
    updateSport,
    deleteSport,
}
