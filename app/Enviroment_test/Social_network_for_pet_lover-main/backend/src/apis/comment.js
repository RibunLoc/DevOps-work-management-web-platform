const express = require('express')
const router = express.Router()

const commentController = require('../controllers/CommentController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/create', commentController.create)
router.use('/getCommentsByPostId', commentController.getCommentsByPostId)
router.use('/getCommentsByCommentId', commentController.getCommentsByCommentId)
router.use('/delete', commentController.deleteCommentByCommentId)
router.use('/update', commentController.updateCommentByCommentId)

module.exports = router