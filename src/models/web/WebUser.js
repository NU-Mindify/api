const mongoose = require('mongoose');

const WebUsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  age: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true
  }
})

const WebUsersModel = mongoose.model("webusers", WebUsersSchema);

module.exports = WebUsersModel;