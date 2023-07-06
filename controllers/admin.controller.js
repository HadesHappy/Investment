const Admin = require('../models/Admin')

const getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find()
    res.status(200).send(admins)

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAdmin
}