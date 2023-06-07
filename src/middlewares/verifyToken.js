const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  if (authorizationHeader !== undefined) {
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.MY_SECRET, (err, result) => {
      if (err) return res.status(404).send({ message: 'Error de autenticación' })

      next()
    }
    )
  }
}

exports.verifyToken = verifyToken
