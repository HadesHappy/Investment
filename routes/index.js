const express = require('express')
const app = express()

const depositRoutes = require('./deposit')
const investorRoutes = require('./investor')
const adminRoutes = require('./admin')

app.use('/deposit', depositRoutes)
app.use('/investor', investorRoutes)
app.use('/admin', adminRoutes)

module.exports = app