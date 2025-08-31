const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
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
    },
    useravatar: {
        type: String,
        required: true
    }
}, { timestamps: true })

const LogsModel = mongoose.model("logs", LogsSchema);

module.exports = LogsModel;