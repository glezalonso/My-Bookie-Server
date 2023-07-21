const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if (authorizationHeader !== undefined) {
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.SECURITY_BOOKIE, (err, result) => {
            if (err)
                return res
                    .status(404)
                    .json({ message: 'Error de autenticación' })

            next()
        })
    }
}

module.exports = { verifyToken }
