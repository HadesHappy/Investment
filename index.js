const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const uri = process.env.INVESTMENT_URI

try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Mongoose is connected."))
} catch (e) {
  console.log("Can not connect.")
}

const connection = mongoose.connection
connection.once('once', () => {
  console.log("MongoDB success")
})

const Routes = require('./routes/index')
app.use('/api', Routes)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})
