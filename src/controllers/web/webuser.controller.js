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

async function getUsersByBranch(req, res) {
  try {
    const branch = req.params.branch;

    let usersByBranch;

    if (!branch || branch === "All") {
      usersByBranch = await WebUsersModel.find({});
    } else {
      usersByBranch = await WebUsersModel.find({ branch });
    }

    res.json(usersByBranch);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
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

const createWebUser = (req, res) => {
  const newWebUser = new WebUsersModel(req.body);
  newWebUser.save()
   .then(webuser => res.json(webuser))
   .catch(err=>{
    console.log(err);
    res.status(500).json({error:"Internal Server Error"})
   })
}


module.exports = { getWebUsers , getWebUser, updateWebUsers, createWebUser, getUsersByBranch }
