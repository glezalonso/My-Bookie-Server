const LeagueModel = require('../models/League.model')
const ObjectId = require('mongoose').Types.ObjectId
const { upload } = require('../libs/cloudinary')

const getLeagues = (req, res) => {
    LeagueModel.find()
        .populate('sport', { __v: 0, status: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(501)
                .json({ message: 'No hay ligas para mostrar ', error })
        )
}

const getLeague = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    LeagueModel.findOne({ _id: id })
        .populate('sport', { __v: 0, status: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(501)
                .json({ message: 'No hay ligas para mostrar', error })
        )
}

const createLeague = async (req, res) => {
    const { league, description, sport } = req.body
    if (req.files) {
        const { poster } = req.files
        try {
            const { secure_url } = await upload(poster.tempFilePath)
            const newLeague = new LeagueModel({
                league,
                description,
                poster: secure_url,
                sport,
            })
            newLeague
                .save()
                .then((data) => res.status(201).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message: 'Hubo un error al crear la liga ',
                        error,
                    })
                )
        } catch (error) {
            res.status(501).json({
                message: 'Hubo un error al crear la liga ',
                error,
            })
        }
    } else {
        const newLeague = new LeagueModel({
            league,
            description,
            sport,
        })
        newLeague
            .save()
            .then((data) => res.status(201).json(data))
            .catch((error) =>
                res
                    .status(501)
                    .json({ message: 'Hubo un error al crear la liga ', error })
            )
    }
}

const updateLeague = async (req, res) => {
    const { id } = req.params
    const { league, description, sport } = req.body
    if (req.files) {
        const { poster } = req.files
        try {
            const { secure_url } = await upload(poster.tempFilePath)
            await LeagueModel.findOneAndUpdate(
                { _id: id },
                {
                    league,
                    description,
                    poster: secure_url,
                    sport,
                },
                { new: true }
            )
                .then((data) => res.status(201).json(data))
                .catch((error) =>
                    res.status(501).json({
                        message: 'No se podido actualizar la liga ',
                        error,
                    })
                )
        } catch (error) {
            res.status(501).json({
                message: 'No se podido actualizar la liga ',
                error,
            })
        }
    } else {
        await LeagueModel.findOneAndUpdate(
            { _id: id },
            {
                league,
                description,

                sport,
            },
            { new: true }
        )
            .then((data) => res.status(201).json(data))
            .catch((error) =>
                res.status(501).json({
                    message: 'No se podido actualizar la liga ',
                    error,
                })
            )
    }
}

const deleteLeague = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    LeagueModel.deleteOne({ _id: id })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .satus(501)
                .json({ message: 'No se ha podido borrar la liga ', error })
        )
}
const getLeaguesBySport = (req, res) => {
    const { sport } = req.params
    LeagueModel.find({ sport })
        .populate('sport', { __v: 0, status: 0 })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(501)
                .json({ message: 'No hay ligas para mostrar ', error })
        )
}

module.exports = {
    createLeague,
    getLeagues,
    getLeague,
    updateLeague,
    deleteLeague,
    getLeaguesBySport,
}
