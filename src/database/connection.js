const mongoose = require('mongoose')

// Database local connection without user
const connection = async () => {
  const db = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8o10hsa.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`)
    .then(res => console.log(`Se ha conectado correctamente a la base de datos ${process.env.DB_DATABASE}`))
    .catch(err => console.log(`Ha ocurrido un error al conectarse a la base de datos ${err}`))
}
module.exports = connection
