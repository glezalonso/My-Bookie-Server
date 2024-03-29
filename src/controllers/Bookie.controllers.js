const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const BookieModel = require('../models/Bookies.model')
const MessageModel = require('../models/Message.model')
const ObjectId = require('mongoose').Types.ObjectId

const register = async (req, res) => {
    const { fullName, username, email, password } = req.body

    try {
        const exitEmail = await BookieModel.findOne({ email })
        if (exitEmail)
            return res.status(501).json({ error: 'El email ya esta en uso' })

        const exitUsername = await BookieModel.findOne({ username })
        if (exitUsername)
            return res.status(501).json({ error: 'El usuario ya esta en uso' })

        const passwordHash = await bcrypt.hash(password, 10)

        const registerBookie = new BookieModel({
            fullName,
            username,
            email,
            password: passwordHash,
        })
        registerBookie.save()
        if (!registerBookie)
            return res.status(501).json({ error: 'Ha ocurrido un error' })
        const token = jwt.sign(
            { username: registerBookie.username },
            process.env.SECURITY_BOOKIE,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            username: registerBookie.username,
            id: registerBookie._id,
            token,
        })
    } catch (error) {
        return res.status(501).json({ error: 'Ha ocurrido un error' })
    }
}

const loginBookie = async (req, res) => {
    const { username, password } = req.body
    try {
        const existBookie = await BookieModel.findOne({ username })
        if (!existBookie)
            return res.status(501).json({ error: 'Credenciales incorrectas' })

        const verifyPass = await bcrypt.compare(password, existBookie.password)
        if (!verifyPass)
            return res.status(501).json({ error: 'Credenciales incorrectas' })

        const token = jwt.sign(
            { username: existBookie.username },
            process.env.SECURITY_BOOKIE,
            { expiresIn: '7d' }
        )
        res.status(201).json({
            username: existBookie.username,
            id: existBookie._id,
            token,
        })
    } catch (error) {
        return res.status(501).json({ error: 'Ha ocurrido un error' })
    }
}

const getBookies = (req, res) => {
    BookieModel.find({})
        .populate('followers follow tournaments')
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
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    BookieModel.findOne({ _id: id })
        .populate('followers follow tournaments')
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al mostar los bookies',
                error,
            })
        )
}

const updateBookie = async (req, res) => {
    const { id } = req.params
    const { fullName, username, email, password } = req.body

    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
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
}
const deleteBookie = (req, res) => {
    const { id } = req.params
    if (!ObjectId.isValid(id))
        return res.status(501).json({
            messsage: 'Ha ocurrido un error en la peticion',
        })
    BookieModel.findOneAndDelete({ _id: id })
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Hubo un error al borrar el Bookie',
                error,
            })
        )
}

const getBookiePicks = (req, res) => {
    const { username } = req.params
    BookieModel.findOne({ username })
        .populate('votes.match')
        .then((data) => res.status(200).json(data))
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al mostar los bookies',
                error,
            })
        )
}

const addFollower = async (req, res) => {
    const { id } = req.params
    const { follower } = req.body
    BookieModel.findOneAndUpdate(
        { _id: id },
        { $push: { followers: follower } }
    )
        .then(async () => {
            await BookieModel.findOneAndUpdate(
                { _id: follower },
                { $push: { follow: id } },
                { new: true }
            )
        })
        .then(() =>
            res.status(202).json({
                message: 'Estas siguiendo exitosamente',
            })
        )
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al seguir al usuario',
                error,
            })
        )
}

const removeFollower = (req, res) => {
    const { id } = req.params
    const { follower } = req.body

    BookieModel.findOneAndUpdate(
        { _id: id },
        { $pull: { followers: follower } }
    )
        .then(async () => {
            await BookieModel.findOneAndUpdate(
                { _id: follower },
                { $pull: { follow: id } },
                { new: true }
            )
        })
        .then((data) => {
            console.log(data)
            res.status(202).json({
                message: 'Estas siguiendo exitosamente',
            })
        })
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al seguir al usuario',
                error,
            })
        )
}

const addAvatar = (req, res) => {
    const { id } = req.params
    const { avatar } = req.body
    BookieModel.findOneAndUpdate({ _id: id }, { avatar }, { new: true })
        .then((data) => {
            res.status(202).json({
                message: 'Estas siguiendo exitosamente',
            })
        })
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al seguir al usuario',
                error,
            })
        )
}

const getBookieTop = async (req, res) => {
    try {
        const top = await BookieModel.find(
            { total: { $gte: 50 } },
            { password: 0, __v: 0, email: 0, fullName: 0 }
        )

        if (top) {
            const topUsers = top
                ?.sort(
                    (a, b) =>
                        (b?.success * 100) / b?.total -
                        (a?.success * 100) / a?.total
                )
                .slice(0, 10)

            res.status(200).json(topUsers)
        } else {
            res.status(400).json({
                message: 'No hay top',
            })
        }
    } catch (error) {
        res.status(501).json({
            message: 'Ha ocurrido un error al mostrarlos juegos',
            error,
        })
    }
}

const createMessage = (req, res) => {
    const { email, subject, content } = req.body

    const message = new MessageModel({
        email,
        subject,
        content,
    })
    message
        .save()
        .then((data) => res.status(202).json(data))
        .catch((error) => res.status(500).json(error))
}

const getTopMonth = async (req, res) => {
    const { date } = req.params
    const minimun = new Date().getDate()

    try {
        const data = await BookieModel.find({
            'matchesSuccess.date': { $regex: date, $options: 'i' },
        })

        const top = data?.filter(
            (user) =>
                user.matchesSuccess.filter(
                    (match) => match?.date?.slice(0, 7) === date
                ).length +
                    user.matchesFailure.filter(
                        (match) => match?.date?.slice(0, 7) === date
                    ).length >
                minimun
        )

        if (top) {
            const topUsers = top
                ?.sort(
                    (a, b) =>
                        (b?.matchesSuccess?.filter(
                            (match) => match?.date?.slice(0, 7) === date
                        )?.length *
                            100) /
                            (b?.matchesSuccess?.filter(
                                (match) => match?.date?.slice(0, 7) === date
                            )?.length +
                                b?.matchesFailure?.filter(
                                    (match) => match?.date?.slice(0, 7) === date
                                )?.length) -
                        (a?.matchesSuccess?.filter(
                            (match) => match?.date?.slice(0, 7) === date
                        )?.length *
                            100) /
                            (a?.matchesSuccess?.filter(
                                (match) => match?.date?.slice(0, 7) === date
                            )?.length +
                                a?.matchesFailure?.filter(
                                    (match) => match?.date?.slice(0, 7) === date
                                )?.length)
                )
                .slice(0, 10)

            res.status(200).json(topUsers)
        } else {
            res.status(400).json({
                message: 'No hay top',
            })
        }
    } catch (error) {
        res.status(501).json({
            message: 'Ha ocurrido un error al mostrarlos juegos',
            error,
        })
    }
}

const getTopMonthSport = async (req, res) => {
    const { date, sport } = req.params
    const minimun = new Date().getDate()

    try {
        const data = await BookieModel.find({
            $or: [
                {
                    matchesSuccess: {
                        $elemMatch: {
                            sport,
                            date: { $regex: date },
                        },
                    },
                },
                {
                    matchesFailure: {
                        $elemMatch: {
                            sport,
                            date: { $regex: date },
                        },
                    },
                },
            ],
        })

        const top = data?.filter(
            (user) =>
                user.matchesSuccess.filter(
                    (match) =>
                        match?.date?.slice(0, 7) === date &&
                        String(match?.sport) === sport
                ).length +
                    user.matchesFailure.filter(
                        (match) =>
                            match?.date?.slice(0, 7) === date &&
                            String(match?.sport) === sport
                    ).length >
                minimun
        )

        if (top) {
            const topUsers = top?.sort(
                (a, b) =>
                    (Number(
                        b?.matchesSuccess?.filter(
                            (match) =>
                                match?.date?.slice(0, 7) === date &&
                                String(match?.sport) === sport
                        )?.length
                    ) *
                        100) /
                        (Number(
                            b?.matchesSuccess?.filter(
                                (match) =>
                                    match?.date?.slice(0, 7) === date &&
                                    String(match?.sport) === sport
                            )?.length
                        ) +
                            Number(
                                b?.matchesFailure?.filter(
                                    (match) =>
                                        match?.date?.slice(0, 7) === date &&
                                        String(match?.sport) === sport
                                )?.length
                            )) -
                    (Number(
                        a?.matchesSuccess?.filter(
                            (match) =>
                                match?.date?.slice(0, 7) === date &&
                                String(match?.sport) === sport
                        )?.length
                    ) *
                        100) /
                        (Number(
                            a?.matchesSuccess?.filter(
                                (match) =>
                                    match?.date?.slice(0, 7) === date &&
                                    String(match?.sport) === sport
                            )?.length
                        ) +
                            Number(
                                a?.matchesFailure?.filter(
                                    (match) =>
                                        match?.date?.slice(0, 7) === date &&
                                        String(match?.sport) === sport
                                )?.length
                            ))
            )

            res.status(200).json(topUsers)
        } else {
            res.status(400).json({
                message: 'No hay top',
            })
        }
    } catch (error) {
        res.status(501).json({
            message: 'Ha ocurrido un error al mostrarlos juegos',
            error,
        })
    }
}

const getBookiesPage = async (req, res) => {
    const page = parseInt(req.params.page)
    const perPage = 22

    const total = await BookieModel.count({})

    const totalPages = Math.ceil(total / perPage)
    BookieModel.find({})
        .populate('followers follow')
        .skip(page * perPage - perPage)
        .limit(perPage)
        .then((data) => res.status(200).json({ data, page, total, totalPages }))
        .catch((error) =>
            res.status(500).json({
                message: 'Ha ocurrido un error al mostar los bookies',
                error,
            })
        )
}

const getBookieChampion = async (req, res) => {
    const { season, minimun } = req.params

    try {
        const data = await BookieModel.find({
            $or: [
                {
                    matchesSuccess: {
                        $elemMatch: {
                            season,
                        },
                    },
                },
                {
                    matchesFailure: {
                        $elemMatch: {
                            season,
                        },
                    },
                },
            ],
        })

        const top = data?.filter(
            (user) =>
                user.matchesSuccess.filter(
                    (match) => String(match.season) === season
                ).length +
                    user.matchesFailure.filter(
                        (match) => String(match.season) === season
                    ).length >
                minimun
        )

        const winners = top?.sort((a, b) => {
            return (
                (b?.matchesSuccess?.filter(
                    (match) => String(match?.season) === season
                )?.length *
                    100) /
                    (b?.matchesSuccess?.filter(
                        (match) => String(match?.season) === season
                    )?.length +
                        b?.matchesFailure?.filter(
                            (match) => String(match?.season) === season
                        )?.length) -
                (a?.matchesSuccess?.filter(
                    (match) => String(match?.season) === season
                )?.length *
                    100) /
                    (a?.matchesSuccess?.filter(
                        (match) => String(match?.season) === season
                    )?.length +
                        a?.matchesFailure?.filter(
                            (match) => String(match?.season) === season
                        )?.length || b?.matchesSuccess - a?.matchesSuccess)
            )
        })

        res.status(200).json(winners)
    } catch (error) {
        res.status(500).json({
            message: 'Ha ocurrido un error al mostar los bookies',
            error,
        })
    }
}

const getBookieChampionRound = async (req, res) => {
    const { round, minimun } = req.params

    try {
        const data = await BookieModel.find({
            $or: [
                {
                    matchesSuccess: {
                        $elemMatch: {
                            round,
                        },
                    },
                },
                {
                    matchesFailure: {
                        $elemMatch: {
                            round,
                        },
                    },
                },
            ],
        })

        const top = data?.filter(
            (user) =>
                user.matchesSuccess.filter(
                    (match) => String(match.round) === round
                ).length +
                    user.matchesFailure.filter(
                        (match) => String(match.round) === round
                    ).length >
                minimun
        )

        const winners = top?.sort((a, b) => {
            return (
                (b?.matchesSuccess?.filter(
                    (match) => String(match?.round) === round
                )?.length *
                    100) /
                    (b?.matchesSuccess?.filter(
                        (match) => String(match?.round) === round
                    )?.length +
                        b?.matchesFailure?.filter(
                            (match) => String(match?.round) === round
                        )?.length) -
                (a?.matchesSuccess?.filter(
                    (match) => String(match?.round) === round
                )?.length *
                    100) /
                    (a?.matchesSuccess?.filter(
                        (match) => String(match?.round) === round
                    )?.length +
                        a?.matchesFailure?.filter(
                            (match) => String(match?.round) === round
                        )?.length ||
                        b?.matchesSuccess +
                            b.matchesFailure -
                            a?.matchesSuccess +
                            b.matchesFailure)
            )
        })

        res.status(200).json(winners)
    } catch (error) {
        res.status(500).json({
            message: 'Ha ocurrido un error al mostar los bookies',
            error,
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
    getBookiePicks,
    addFollower,
    removeFollower,
    addAvatar,
    getBookieTop,
    createMessage,
    getTopMonth,
    getTopMonthSport,
    getBookiesPage,
    getBookieChampion,
    getBookieChampionRound,
}
