const express = require('express')
const router = express.Router()
const {
    getMessages,
    getMessage,
    deleteMessage,
    updateMessage,
    addComment,
    createMessage,
    removeComment,
} = require('../controllers/Forum.controllers')

const { verifyToken } = require('../middlewares/verifyToken')

router.get('/', getMessages)
router.get('/:id', getMessage)
router.post('/', verifyToken, createMessage)
router.delete('/:id', verifyToken, deleteMessage)
router.put('/:id', verifyToken, updateMessage)
router.put('/addcomment/:id', verifyToken, addComment)
router.put('/removecomment/:id', verifyToken, removeComment)

module.exports = router
