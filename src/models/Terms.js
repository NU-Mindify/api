const mongoose = require('mongoose')

const termsSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  meaning: {
    type: String,
    required: true,
  },
  tags:{
    type:String,
    required: true,
  },
  is_deleted: { 
    type: Boolean, 
    default: false,
  },
})

const TermsModel = mongoose.model("terms", termsSchema)

module.exports = TermsModel;