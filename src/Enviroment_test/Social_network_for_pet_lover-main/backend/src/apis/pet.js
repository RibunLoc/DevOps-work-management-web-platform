const express = require('express')
const router = express.Router()

const petController = require('../controllers/PetController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/create', petController.create)
router.use('/getbyuserid', petController.getPetsByUserId)
router.use('/delete', petController.deletePetById)
router.use('/update', petController.updateById)

module.exports = router