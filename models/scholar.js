const mongoose = require('mongoose')
const Schema = mongoose.Schema
const scholarSchema = new Schema({
  account: String,
  eth_address: String,
  ronin_address: String,
  updated_on: Number,
  last_claim_amount: Number,
  last_claim_timestamp: Number,
  ronin_slp: Number,
  total_slp: Number,
  in_game_slp: Number,
  name: String
})
const scholarModel = mongoose.model('scholar', scholarSchema)
module.exports = scholarModel