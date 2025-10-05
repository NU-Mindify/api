const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MindmapSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  prompt:{
    type: Schema.Types.String,
    required: true
  },
  content:{
    type: Schema.Types.Mixed
  }
}, { timestamps: true })

const MindmapModel = mongoose.model("mindmap", MindmapSchema)

module.exports = MindmapModel;