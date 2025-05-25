const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HighestScoreSchema = { 
  time_completion: {
    type: Number,
    required: true
  },
  correct: {
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
  stars: {
    type: Number,
    enum: [0, 1, 2, 3]
  }
}

const ProgressSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    unique: true
  },
  classic: {
    abnormal: {
      type: Number,
      default: 0
    },
    developmental: {
      type: Number,
      default: 0
    },
    psychological: {
      type: Number,
      default: 0
    },
    industrial: {
      type: Number,
      default: 0
    },
    general: {
      type: Number,
      default: 0
    }
  },
  high_scores: {
    abnormal: [HighestScoreSchema],
    developmental: [HighestScoreSchema],
    psychological: [HighestScoreSchema],
    industrial: [HighestScoreSchema],
    general: [HighestScoreSchema],
  }
})

const ProgressModel = mongoose.model("progress", ProgressSchema);

module.exports = ProgressModel;