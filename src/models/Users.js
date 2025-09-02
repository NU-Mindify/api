const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  uid: {
    type: String,
    required:true
  },
  student_id:{
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
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
    type: String,
    default: "b1"
  },
  cloth: {
    type: String,
    default: "male_unform"
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
  },
  items:{
    type: [String],
    default: ["bulldog", "b1", "g1", "female_unform", "male_unform"]
  }
}, { timestamps: true })

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;