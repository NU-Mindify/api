const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserBadgesSchema = new Schema({
  user_id:{
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true

  },
  badge_id:{
    type: Schema.Types.ObjectId,
    ref: 'badges',
    required: true
  }
})

const UserBadgeModel = mongoose.model("user_badges", UserBadgesSchema);

module.exports = UserBadgeModel