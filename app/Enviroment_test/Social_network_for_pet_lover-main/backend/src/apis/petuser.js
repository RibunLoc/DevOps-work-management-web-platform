const express = require('express')
const router = express.Router()

const petUserController = require('../controllers/PetUserController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/create', petUserController.create)
router.use('/favourited/getbyuserid', petUserController.getFavouritedPetsByUserId)
router.use('/delete', petUserController.deletePetUserById)
router.use('/checksaved', petUserController.checkIfPetIsFavourite)

module.exports = router