const mongoose = require('mongoose');
const { MODES } = require('../../constants');

const Schema = mongoose.Schema;

const AttemptsSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  mode: {
    type: String,
    enum: MODES,
    required: true
  },
  level: {
    type: Number,
    required: function () { return this.mode !== "mastery"}
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
  stars:{
    type: Number,
    enum: [0, 1, 2, 3]
  },
  streak: {
    type: Number,
  }
}, {timestamps: true})

const AttemptsModel = mongoose.model("attempts", AttemptsSchema);

module.exports = AttemptsModel