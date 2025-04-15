const UsersModel = require('../models/Users');
const ProgressModel = require('../models/Progress')

async function getUsers(req, res) {
  try {
    const users = await UsersModel.find()
    res.json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function getUser(req, res){
  try {
    const uid = req.params.uid
    
    const user = await UsersModel.findOne({ uid })
    res.json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function createUser(req, res){
  try {
    const newUser = new UsersModel(req.body);
    const user = await newUser.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ error })
  }
}

async function updateUser(req, res) {
  try {
    const { user_id, avatar, username } = req.body
    const result = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: { avatar, username }},
      { new: true, runValidators: true }
    )
    console.log("UpdateUser:",result);
    res.json( result )
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = { getUsers, getUser, createUser, updateUser }