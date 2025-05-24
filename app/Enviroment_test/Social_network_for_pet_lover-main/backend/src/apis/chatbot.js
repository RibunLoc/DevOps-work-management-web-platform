const express = require('express')
const router = express.Router()

const chatbotController = require('../controllers/ChatbotController')



router.use(express.json())
router.get('/',chatbotController.handleUserInput)

// router.delete('/delete',UserController.delete)

module.exports = router

//end_point