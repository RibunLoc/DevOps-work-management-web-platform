const express = require('express')
const router = express.Router()

const registerController = require('../controllers/auth/RegisterController')
const {validate, checkDuplicate} = require('../middlewares/auth/register')

router.use(express.json())
router.use('/', registerController.create)

module.exports = router