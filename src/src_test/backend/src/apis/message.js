const express = require('express')
const router = express.Router()

const messageController = require('../controllers/MessageController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', messageController.get)
router.use('/recent', messageController.getRencentSender)
router.use('/post', messageController.saveMessage)
router.use('/history', messageController.getChatHistory)
router.use('/conversation/get', messageController.getConversation)
router.use('/conversation/post', messageController.postConversation)


module.exports = router