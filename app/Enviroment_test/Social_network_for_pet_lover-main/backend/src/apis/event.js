const express = require('express')
const router = express.Router()

const eventController = require('../controllers/EventController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/create', eventController.create)
router.use('/all', eventController.getAllEvent)

module.exports = router