const { v2 } = require('cloudinary')

v2.config({
    cloud_name: 'dei46qlds',
    api_key: '243823857454177',
    api_secret: 'OHLnOZaY8LMLP6TifGyp7zuBGUA',
})

const upload = async (file) => {
    return await v2.uploader.upload(file, {
        folder: 'bookie',
    })
}

module.exports = {
    upload,
}
