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

//get by uid: uid from database
async function getUser(req, res){
  try {
    const { user_id, uid } = req.query
    if(uid){
      const user = await UsersModel.findOne({ uid })
      res.json(user)
      return;
    }
    if(user_id){
      const user = await UsersModel.findOne({ _id: user_id })
      res.json(user)
      return;
    }
    throw new Error("No uid or user_id provided");
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function searchUser(req, res) {
  try {
    const {name} = req.query
    const regex = new RegExp(name, 'i');

    const user = await UsersModel.aggregate([
      {
        $addFields: {
          full_name: { $concat: ['$first_name', ' ', '$last_name'] }
        }
      },
      {
        $match: {
          $or: [
            { first_name: regex },
            { last_name: regex },
            { full_name: regex },
            { username: regex }
          ]
        }
      },
      {
        $project: {
          full_name: 0
        }
      }
    ]);

    res.json(user)
  } catch (error) {
    console.error(error);
    res.status(500).json(error)
    
  }
}

async function createUser(req, res){
  try {
    const newUser = new UsersModel(req.body);
    const user = await newUser.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ error })
    console.error(error);
  }
}

async function updateUser(req, res) {
  try {
    const { user_id, avatar, cloth, username } = req.body
    const result = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: { avatar, cloth, username }},
      { new: true, runValidators: true }
    )
    console.log("UpdateUser:",result);
    res.json( result )
  } catch (error) {
    res.status(500).json({error})
  }
}

async function userBuy(req, res) {
  const {user_id, item} = req.query
  try {
    const newData = await UsersModel.findByIdAndUpdate(
      user_id,
      { $push: { items: item }, $inc: {points: -5} },
      { new: true } 
    )
    res.json(newData)
  } catch (error) {
    res.status(500).json({error})
  }
}

async function addPoints(req, res){
  const { user_id, stars } = req.query
  try {
    const newData = await UsersModel.findByIdAndUpdate(
      user_id,
      { $inc: { points: stars } },
      { new: true }
    )
    res.json(newData)
  } catch (error) {
    res.status(500).json({ error })
  }
}

async function removeTutorial(req, res) {
  try {
    const { user_id, tutorial } = req.query
    console.log(req.query);
    
    const tutorialPath = `tutorial.${tutorial}`
    const result = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: {[tutorialPath]: false}},
      { new: true, runValidators: true }
    )
    console.log(result);
    
    res.json(result)
  } catch (error) {
    res.status(500).json({error})
  }
}

async function deleteStudent(req, res) {
  try {
    const { user_id, is_deleted } = req.body;

    const deletedUser = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: { "is_deleted": is_deleted } },
      { new: true, runValidators: true }
    );
    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function checkEmailExists(req, res) {
  try {
    const { email } = req.body;
    const User = await UsersModel.findOne({"email": email})
    console.log(User, email);
    
    res.json({
      exists: User ? true : false
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getUsers, getUser, createUser, updateUser, removeTutorial, deleteStudent, userBuy, addPoints, searchUser, checkEmailExists }