const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HighestScoreSchema = new Schema({ 
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
}, {_id: false})

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
  story:{
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
    abnormal: {
      type: Map,
      of: HighestScoreSchema,
      default: () => new Map()
    },
    developmental: {
      type: Map,
      of: HighestScoreSchema,
      default: () => new Map()
    },
    psychological: {
      type: Map,
      of: HighestScoreSchema,
      default: () => new Map()
    },
    industrial: {
      type: Map,
      of: HighestScoreSchema,
      default: () => new Map()
    },
    general: {
      type: Map,
      of: HighestScoreSchema,
      default: () => new Map()
    },
  }
})

const ProgressModel = mongoose.model("progress", ProgressSchema);

module.exports = ProgressModel;