const mongoose = require('mongoose');
const { _categories } = require('../../constants');

const BadgesSchema = new mongoose.Schema({
  title:{
    type: String,
  },
  category:{
    type: String,
    ennum: _categories
  },
  level: {
    type: Number
  },
  filepath:{
    type: String,
    required: true
  }
}, {timestamps: true})

const BadgesModel = mongoose.model("badges", BadgesSchema);

module.exports = BadgesModel