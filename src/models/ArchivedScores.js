const mongoose = require('mongoose');

const archivedScoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  week_start: {
    type: Date,
    required: true
  },
  week_end: {
    type: Date,
    required: true
  }
});

const ArchivedScoreModel = mongoose.model('archived_scores', archivedScoreSchema);

module.exports = ArchivedScoreModel;
