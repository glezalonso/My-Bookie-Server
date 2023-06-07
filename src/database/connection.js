const mongoose = require('mongoose')

// Database local connection without user
const connection = async () => {
  const db = await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_DATABASE}`)
    .then(res => console.log(`Se ha conectado correctamente a la base de datos ${process.env.DB_DATABASE}`))
    .catch(err => console.log(`Ha ocurrido un error al conectarse a la base de datos ${err}`))
}
module.exports = connection
