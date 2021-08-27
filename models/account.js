const mongoose = require('mongoose')
const Schema = mongoose.Schema
const accountSchema = new Schema({
  id:String,
  password:String
})
const accountModel = mongoose.model('account', accountSchema)
module.exports = accountModel