const mongoose = require("mongoose");

const BranchesSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const BranchesModel = mongoose.model("branches", BranchesSchema);

module.exports = BranchesModel;
