const otpGenerator = require('otp-generator')
const UserModel = require('../models/User.model')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const generateOTP = (req, res) => {
  const { email } = req.body
  if (email) {
    UserModel.findOne({ email })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'El email no existe' })
        } else {
          const OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

          const transporter = nodemailer.createTransport({
            service: `${process.env.SERVICE}`,
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            }
          })
          const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `${data.email}`,
            subject: 'Código de Recuperación',
            text: `Hola su codigo de recuperacion es: ${OTP}`
          }

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              res.status(500).json({ err })
            } else {
              UserModel.findOneAndUpdate({ email }, { OTP })
                .then(() => res.status(200).json({ message: 'Se ha enviado email' }))
                .catch(error => res.status(500).json({ error }))
            }
          })
        }
      })
      .catch(error => res.status(404).json({ message: 'Hubo un error al hacer la consulta', error }))
  } else {
    res.status(500).json({ message: 'El campo de email esta vacio' })
  }
}
const verifyOTP = (req, res) => {
  const { email, OTP } = req.body
  UserModel.findOne({ email, OTP })
    .then(data => res.status(202).json(data.OTP))
    .catch(error => res.status(500).json({ message: 'Codigo incorrecto', error }))
}

const resetPassword = async (req, res) => {
  const { password, OTP, email } = req.body
  const passCrypt = await bcrypt.hash(password, 10)
  await UserModel.findOneAndUpdate({ email, OTP }, {
    password: passCrypt,
    OTP: null
  }).then(() => res.status(202).json({ message: 'Contraseña cambiada con exito' }))
    .catch(error => res.status(500).json({ message: 'Hubo un error al cambiar la contraseña', error }))
}

module.exports = { generateOTP, verifyOTP, resetPassword }
