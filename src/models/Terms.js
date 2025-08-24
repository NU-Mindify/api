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
    type: Array,
    required: true,
  },
  is_deleted: { 
    type: Boolean, 
    default: false,
  },
}, {timestamps: true})

const TermsModel = mongoose.model("terms", termsSchema)

module.exports = TermsModel;