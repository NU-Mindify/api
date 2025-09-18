const mongoose = require('mongoose');

const weeklyScoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  points: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

const WeeklyScoreModel = mongoose.model('weekly_scores', weeklyScoreSchema);

module.exports = WeeklyScoreModel;
