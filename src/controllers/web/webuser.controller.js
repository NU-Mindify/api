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

const updateWebUsers = (req,res) => {
  WebUsersModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
   .then(webuser => res.json(webuser))
   .catch(err =>{
      console.log(err);
      res.status(500).json({error:"Internal Server Error"});
   });
}


module.exports = {getWebUsers , getWebUser, updateWebUsers}