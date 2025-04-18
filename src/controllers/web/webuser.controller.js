const WebUsersModel = require('../../models/web/WebUser');

async function getWebUsers(req, res) {
    try {
      const webusers = await WebUsersModel.find()
      res.json(webusers)
    } catch (error) {
      console.log(error);
      res.status(500).json({ error })
    }
  }

module.exports = {getWebUsers}