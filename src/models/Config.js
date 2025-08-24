const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppConfigSchema = Schema({
  _id: { type: String, default: 'app_config' },
  features: {
    type: Object,
    default: {
      glossary: "",
      mindmap: "",
      mindy: "",
      store: "",
      profile: "",
      abnormal: "",
      developmental: "",
      industrial: "",
      psychological: "",
      general: "",
    },
  },

  announcements: {
    type: Object,
    default: {
      everyone: {
        title: "",
        heading: "",
        body: "",
      },
      logged: {
        title: "",
        heading: "",
        body: "",
      },
    },
  },
  glossary_last_updated: {
    type: Date,
    default: Date.now
  },
});

const AppConfigModel = mongoose.model('app_config', AppConfigSchema);

module.exports = AppConfigModel

