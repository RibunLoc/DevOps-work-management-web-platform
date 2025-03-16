const express = require('express')
const router = express.Router()

const postUserController = require('../controllers/PostUserController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/toggleSave', postUserController.toggleSavePost)
router.use('/favourited/getbyuserid', postUserController.getFavouritedPostsByUserId)
router.use('/delete', postUserController.deletePostUserById)

module.exports = router