const express = require('express')
const router = express.Router()

const userController = require('../controllers/UserController')

router.use(express.json())

router.get('/info',userController.getInfo)
router.use('/avatar', userController.setAvatar)
router.use('/verify', userController.verify)
router.use('/getbyid/:userId', userController.getUserById)

router.get('/getAll',userController.getAll)
router.use('/updatename', userController.updateNameByUserId)
router.use('/updatedescription', userController.updateDescriptionByUserId)
router.use('/updateAvatar', userController.updateAvatarByUserId)
router.use('/searchuserbyusername', userController.getUserByUserName)

router.use('/reset_password/send', userController.sendResetLink)
router.use('/reset_password/post', userController.resetPassword)
router.use('/reset_password/:token', userController.resetPasswordForm)

router.use("/change_password/:user_id", userController.changePassword);

router.use("/delete", userController.deleteUser);

module.exports = router

//end_point

