const express = require('express')
const router = express.Router()

const historyController = require('../controllers/HistoryController')
//const { validate, sanitizeInput } = require('../middlewares/login/validate')

router.use(express.json())
// router.use('/', loginController.get)
router.use('/create', historyController.create)
router.use('/delete', historyController.deleteHistory)
router.use('/gethistorysearch', historyController.getSearchHistory)

module.exports = router