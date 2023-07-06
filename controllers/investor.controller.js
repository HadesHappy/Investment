const Investor = require('../models/Investor')

const getAll = async (req, res) => {
  try {
    const investors = await Investor.find()
    res.status(200).send(investors)

  } catch (error) {
    console.log(error)
  }
}

const getInvestorByWallet = async (req, res) => {
  try {
    const investor = await Investor.findOne({
      wallet: req.body.wallet
    })
    res.status(200).send(investor)
  } catch (error) {
    console.log(error)
  }
}

const getInvestorByReferralCode = async (req, res) => {
  try {
    const investor = await Investor.findOne({
      referralCode: req.body.referralCode
    })
    res.status(200).send(investor)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAll,
  getInvestorByWallet,
  getInvestorByReferralCode
}
