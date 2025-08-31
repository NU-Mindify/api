const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionsSchema = Schema({
  start_time:{
    type: Date,
    default: Date.now,
    required: true
  },
  end_time:{
    type: Date,
    required: false 
  },
  duration:{
    type: Number,
    required: false
  },
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
  }],
})

const SessionsModel = mongoose.model("sessions", sessionsSchema)

module.exports = SessionsModel;