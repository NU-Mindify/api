const AppConfigModel = require("../models/Config")

async function getConfig(req, res) {
  try {
    const config = await AppConfigModel.findById('app_config');

    if (!config) {
      const defaultConfig = new AppConfigModel();
      await defaultConfig.save();
      return res.json(defaultConfig);
    }

    res.json(config);
  } catch (error) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = { getConfig };