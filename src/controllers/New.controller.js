const NewModel = require('../models/New.models')
const ObjectId = require('mongoose').Types.ObjectId

const getNews = (req, res) => {
    NewModel.find({})
        .populate('author league')
        .sort({ date: 'desc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(505)
                .json(
                    { message: 'Ha ocurrido un error al mostrar las nocticas' },
                    error
                )
        )
}

const getNew = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    NewModel.findOne({ _id: id })
        .populate('author league')
        .sort({ date: 'desc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(505).json(
                {
                    message: 'Ha ocurrido un error al mostrar la noticia',
                },
                error
            )
        )
}

const createNew = (req, res) => {
    const { sport, league, date, content, author, title } = req.body
    const newNew = new NewModel({
        sport,
        league,
        title,
        date,
        content,
        author,
    })
    newNew
        .save()
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res
                .status(500)
                .json({ message: 'Hubo un error al crear la noticia' }, error)
        )
}

const updateNew = (req, res) => {
    const { id } = req.params
    const { sport, league, date, content, author, title } = req.body
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    NewModel.findOneAndUpdate(
        { _id: id },
        {
            sport,
            league,
            title,
            date,
            content,
            author,
        },
        { new: true }
    )
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al modificar la noticia',
                error,
            })
        )
}

const deleteNew = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    NewModel.findOneAndDelete({ _id: id })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Hubo un error al borrar la noticia',
                error,
            })
        )
}

const getNewsBySport = (req, res) => {
    const { sport } = req.body
    if (!ObjectId.isValid(sport))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    NewModel.find({ sport })
        .populate('author sport')
        .sort({ date: 'desc' })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(505).json(
                {
                    message: 'Ha ocurrido un error al mostrar la noticia',
                },
                error
            )
        )
}

module.exports = {
    getNew,
    getNews,
    createNew,
    updateNew,
    deleteNew,
    getNewsBySport,
}
