const mongoose = require("mongoose");

const BranchesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  stud_extension: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const BranchesModel = mongoose.model("branches", BranchesSchema);

module.exports = BranchesModel;
