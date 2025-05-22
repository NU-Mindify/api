const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { MODES } = require('../../constants');

const LeaderboardsSchema = new Schema({
  level:String,
  category:String,
  mode:{
    type: String,
    enum: MODES
  },
  scores:[{
    user_id:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    score: Number,
    time:Number,
    branch:String
  }]
})

const LeaderboardsModel = mongoose.model("leaderboards", LeaderboardsSchema)

module.exports = LeaderboardsModel;