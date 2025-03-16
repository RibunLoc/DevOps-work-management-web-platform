const express = require('express')
const router = express.Router()

const imageController = require('..//controllers/ImageController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', messageController.get)
router.use('/upload', imageController.uploadFile)
router.use('/get', imageController.retriveFile)



module.exports = router