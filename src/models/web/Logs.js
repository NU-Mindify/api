const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true }) //automatic na to gagawa nung  time and date (createdAt, updatedAt)

const LogsModel = mongoose.model("logs", LogsSchema);

module.exports = LogsModel;