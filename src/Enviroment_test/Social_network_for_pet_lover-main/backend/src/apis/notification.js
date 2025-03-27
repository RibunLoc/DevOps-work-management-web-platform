const express = require('express')
const router = express.Router()

const notificationController = require('../controllers/NotificationController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/create', notificationController.create)
router.use('/get', notificationController.getRecentNoti)

module.exports = router