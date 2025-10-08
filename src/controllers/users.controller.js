const UsersModel = require('../models/Users');
const ProgressModel = require('../models/Progress');


async function getUsers(req, res) {
  try {
    const users = await UsersModel.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function getUser(req, res) {
  try {
    const { user_id, uid } = req.query;
    let user;
    if (uid) user = await UsersModel.findOne({ uid });
    else if (user_id) user = await UsersModel.findById(user_id);
    else throw new Error("No uid or user_id provided");

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function searchUser(req, res) {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i');

    const users = await UsersModel.aggregate([
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
        $project: { full_name: 0 }
      }
    ]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function createUser(req, res) {
  try {
    const newUser = new UsersModel({
      ...req.body,
      lifespan: new Date(Date.now() + 1460 * 24 * 60 * 60 * 1000)
    });

    const user = await newUser.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function updateUser(req, res) {
  try {
    const { user_id, avatar, cloth, username } = req.body;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { avatar, cloth, username },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function userBuy(req, res) {
  try {
    const { user_id, item } = req.query;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { $push: { items: item }, $inc: { points: -10 } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

async function addTitle(req, res) {
  try {
    const { user_id, title } = req.query;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { $push: { owned_titles: title } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

async function equipTitle(req, res) {
  try {
    const { user_id, title } = req.query;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: { title: title } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function addPoints(req, res) {
  try {
    const { user_id, stars } = req.query;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { $inc: { points: stars } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function removeTutorial(req, res) {
  try {
    const { user_id, tutorial } = req.query;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: { [`tutorial.${tutorial}`]: false } },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function changeSettings(req, res) {
  try {
    const { user_id, music, sfx } = req.body;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { $set: { "settings.music": music, "settings.sfx": sfx } },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function deleteStudent(req, res) {
  try {
    const { user_id, is_deleted } = req.body;
    const user = await UsersModel.findByIdAndUpdate(
      user_id,
      { is_deleted },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function checkEmailExists(req, res) {
  try {
    const { email } = req.body;
    const exists = await UsersModel.exists({ email });
    res.json({ exists: !!exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function checkUsernameExists(req, res) {
  try {
    const { username } = req.body;
    const exists = await UsersModel.exists({ username });
    res.json({ exists: !!exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function resetLifespan(req, res) {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });

    const user = await WebUsersModel.findByIdAndUpdate(
      user_id,
      { $set: { lifespan: new Date(Date.now() + 1460 * 24 * 60 * 60 * 1000) } },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in tryUpdateTTL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function countStudents(req, res) {
  try {
    const students = await UsersModel.countDocuments({ is_deleted: false });
    res.json({ totalStudents: students });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Count students error" });
  }
}


module.exports = {
  getUsers,
  getUser,
  searchUser,
  createUser,
  updateUser,
  userBuy,
  addPoints,
  removeTutorial,
  changeSettings,
  deleteStudent,
  checkEmailExists,
  checkUsernameExists,
  resetLifespan,
  addTitle,
  equipTitle,
  countStudents
};
