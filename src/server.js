// Dependencies
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')

// Routes
const apiRoutes = require('./routes/Api.routes')
const sportRoutes = require('./routes/Sport.routes')
const userRoutes = require('./routes/User.routes')
const leagueRoutes = require('./routes/League.routes')
const playerRoutes = require('./routes/Player.routes')
const seasonRoutes = require('./routes/Season.routes')
const teamRoutes = require('./routes/Team.routes')
const matchRoutes = require('./routes/Match.routes')
const roundRoutes = require('./routes/Round.routes')

const app = express()
const verifyToken = require('./middlewares/verifyToken')
// Middlewares
dotenv.config({ path: 'src/.env' })
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT, credentials: true }))
app.use(morgan('tiny'))
app.disable('x-powered-by')

// Settings serve
app.set('title', 'myBookie')
app.set('port', process.env.PORT || 3000)
const connection = require('./database/connection')

// Use routes
app.get('/', (req, res) => res.send('INDEX'))
app.use('/api', apiRoutes)
app.use('/api/users', verifyToken.verifyToken, userRoutes)
app.use('/api/sports', verifyToken.verifyToken, sportRoutes)
app.use('/api/leagues', verifyToken.verifyToken, leagueRoutes)
app.use('/api/players', verifyToken.verifyToken, playerRoutes)
app.use('/api/seasons', verifyToken.verifyToken, seasonRoutes)
app.use('/api/teams', verifyToken.verifyToken, teamRoutes)
app.use('/api/matches', verifyToken.verifyToken, matchRoutes)
app.use('/api/rounds', verifyToken.verifyToken, roundRoutes)
app.get('/*', (req, res) => res.status(404).send({ error: 'Ruta no encontrada' }))

// server listen when connection to database is already
connection()
  .then(() => {
    try {
      app.listen(app.get('port'), () => console.log(`${app.get('title')} esta corriendo por el puerto: ${app.get('port')}`))
    } catch (error) {
      console.log('No se podido acceder al servidor')
    }
  })
  .catch((error) => console.log(`El servidor no se pudo conectar a la base de datos ${error}`))

module.export = app
