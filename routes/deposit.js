const express = require('express')
const router = express.Router()
const depositController = require('../controllers/deposit.controller')

router.post('/', depositController.deposit)

module.exports = router