const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User.model')

const getUsers = (req, res) => {
  UserModel.find()
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Hubo un error al cargar los usuarios', error }))
}

const getUser = (req, res) => {
  const { id } = req.params
  UserModel.findById(id)
    .then(data => res.status(200).send(data))
    .catch(error => res.status(501).send({ message: 'Hubo un error al cargar los usuarios!', error }))
}

const loginUser = async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)
  try {
    const existUser = await UserModel.findOne({ username })
    if (!existUser) return res.status(501).send({ message: 'Usuario y/o contraseña no valida' })

    bcrypt.compare(password, existUser.password)
      .then(data => {
        if (!data) res.status(501).send({ message: 'Usuario y/o contraseña no valida' })

        const token = jwt.sign({ userId: existUser._id, username: existUser.username }, process.env.MY_SECRET, { expiresIn: '24h' })
        res.status(201).send({ token, username: existUser.username })
      })
      .catch(err => console.error(err))
  } catch (error) {
    return res.status(501).send({ message: 'Hubo un error al iniciar sesión', error })
  }
}

const registerUser = async (req, res) => {
  const { username, password, email, fullname, rol } = req.body
  try {
    const existUser = await UserModel.findOne({ username })
    if (existUser) return res.status(404).send({ message: 'Usuario ya existe!' })

    const existEmail = await UserModel.findOne({ email })
    if (existEmail) return res.status(404).send({ message: 'email ya existe!' })

    const passCrypt = await bcrypt.hash(password, 10)
    const registerUser = new UserModel({
      username,
      password: passCrypt,
      email,
      fullname,
      rol
    })
    registerUser.save()
      .then(data => {
        return res.status(201).send(data.username)
      })
      .catch(error => {
        return res.status(501).send({ message: 'Ha ocurrido un error al registar el usuario', error })
      })
  } catch (error) {
    return res.status(501).send({ message: 'Ha ocurrido un error al registar el usuario', error })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params
  const { username, password, email, fullname, rol } = req.body
  try {
    const passCrypt = await bcrypt.hash(password, 10)
    await UserModel.findOneAndUpdate({ _id: id }, {
      username,
      password: passCrypt,
      email,
      fullname,
      rol
    }, { new: true })
      .then(data => res.status(201).send(data))
      .catch(error => res.status(501).send({ message: 'No se ha podido actualizar el usuario', error }))
  } catch (error) {
    return res.status(501).send({ message: 'No se ha podido actualizar el usuario ', error })
  }
}

const deleteUser = (req, res) => {
  const { id } = req.params
  UserModel.deleteOne({ _id: id })
    .then(() => res.status(201).send({ message: 'El usuario se ha borrado exitosamente!' }))
    .catch(error => res.status(505).send({ message: 'Hubo un error al intentar borrar el usuario ', error }))
}

module.exports = { getUsers, getUser, loginUser, registerUser, updateUser, deleteUser }
