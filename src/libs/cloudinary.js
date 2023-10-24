const { v2 } = require('cloudinary')
const dotenv = require('dotenv')
dotenv.config({ path: 'src/.env' })

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
})

const upload = async (file) => {
    return await v2.uploader.upload(file, {
        folder: 'bookie',
    })
}

const remove = async (id) => {
    return await v2.uploader.destroy(id)
}
module.exports = {
    upload,
    remove,
}
