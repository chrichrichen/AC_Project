const express = require('express')
const router = express.Router()
const clockController = require('../../controllers/clock-controller')
router.get('/',clockController.clockPage)

module.exports = router