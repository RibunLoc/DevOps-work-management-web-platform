const express = require('express')
const router = express.Router()

const loginController = require('../controllers/auth/LoginController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/', loginController.verify)

module.exports = router