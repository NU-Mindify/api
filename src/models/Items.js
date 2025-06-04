const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["avatar", "clothes"]
  },
  index: {
    type: Number
  }
})

const ItemsModel = mongoose.model("items", ItemsSchema);

module.exports = ItemsModel