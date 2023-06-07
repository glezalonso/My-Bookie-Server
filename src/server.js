const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connection = require('./database/connection')

const sportRoutes = require('./routes/Sport.routes')
const userRoutes = require('./routes/User.routes')
const leagueRoutes = require('./routes/League.routes')
const playerRoutes = require('./routes/Player.routes')
const seasonRoutes = require('./routes/Season.routes')
const teamRoutes = require('./routes/Team.routes')
const matchRoutes = require('./routes/Match.routes')
const roundRoutes = require('./routes/Round.routes')

const app = express()

dotenv.config({ path: 'src/.env' })
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT, credentials: true }))
app.use(morgan('tiny'))
app.disable('x-powered-by')

app.set('title', 'myBookie')
app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => res.json({ msg: 'index' }))
app.use('/api/users', userRoutes)
app.use('/api/sports', sportRoutes)
app.use('/api/leagues', leagueRoutes)
app.use('/api/players', playerRoutes)
app.use('/api/seasons', seasonRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/rounds', roundRoutes)
app.get('/*', (req, res) => res.status(404).send({ error: 'Ruta no encontrada' }))

connection()
  .then(() => {
    try {
      app.listen(app.get('port'), () => console.log(`${app.get('title')} esta corriendo por el puerto: ${app.get('port')}`))
    } catch (error) {
      console.log('No se podido acceder al servidor')
    }
  })
  .catch((error) => console.log(`El servidor no se pudo conectar a la base de datos ${error}`))
