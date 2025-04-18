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

async function getWebUser(req, res) {
  try {
    const uid = req.params.uid

    const webuser = await WebUsersModel.findOne({uid})
    res.json(webuser)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}




module.exports = {getWebUsers , getWebUser}