const mongoose = require('mongoose');

const WebUsersSchema = new mongoose.Schema({
  uid: {
    type: String,
    required:true
  },
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  employeenum: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true
  }
})

const WebUsersModel = mongoose.model("webusers", WebUsersSchema);

module.exports = WebUsersModel;