const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AttemptsSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  level: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['abnormal', 'developmental', 'psychological', 'industrial', 'general'],
    required: true
  },
  time_completion: {
    type: Number,
    required: true
  },
  correct:{
    type: Number,
    required: true
  },
  wrong: {
    type: Number,
    required: true
  },
  total_items: {
    type: Number,
    required: true
  },
  branch:{
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum:['classic', 'mastery'],
    required: true
  },
  created_at:{
    type: Date,
    default: Date.now
  }
})

const AttemptsModel = mongoose.model("attempts", AttemptsSchema);

module.exports = AttemptsModel