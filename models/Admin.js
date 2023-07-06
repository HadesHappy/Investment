const mongoose = require('mongoose')
const modelName = 'Admin'

const AdminSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model(modelName, AdminSchema)