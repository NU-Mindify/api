const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  uid: {
    type: String,
    required:true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  branch:{
    type:String,
    requried:true,
  },
  avatar: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;