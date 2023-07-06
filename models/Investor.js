const mongoose = require('mongoose')
const modelName = 'Investor'

const InvestorSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
  },
  startLevel: {
    type: Number,
    required: true,
    default: 0,
  },
  currentLevel: {
    type: Number,
    required: true,
    default: 0,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  trees: [{
    level: {
      type: Number,
      required: true,
      default: 0,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    users: [{
      type: String
    }]
  }]
},
  {
    timestamps: true,
  })

module.exports = mongoose.model(modelName, InvestorSchema)