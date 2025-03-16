const express = require('express')
const router = express.Router()
const likeController = require('../controllers/LikeController')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/likepost', likeController.createLikePost)
module.exports = router