const express = require('express')
const router = express.Router()
const investorController = require('../controllers/investor.controller')

router.get('/', investorController.getAll)
router.get('/referralCode', investorController.getInvestorByReferralCode)
router.get('/wallet', investorController.getInvestorByWallet)

module.exports = router