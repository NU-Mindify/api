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
  },
  is_deleted:{
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  },
  tutorial: {
    worlds: {
      type: Boolean,
      default: true,
    },
    review: {
      type: Boolean,
      default: true
    },
    competition: {
      type: Boolean,
      default: true
    },
    mastery: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true })

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;