const WebUsersModel = require("../../models/web/WebUser");

async function getWebUsers(req, res) {
  try {
    const webusers = await WebUsersModel.find();
    res.json(webusers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
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
    const uid = req.params.uid;
    const webuser = await WebUsersModel.findOne({ uid });
    res.json(webuser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function loginByEmail(req, res) {
  try {
    const email = req.params.email;
    const webUserEmail = await WebUsersModel.findOne({ email });
    res.json(webUserEmail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function tryUpdateTTL(req, res) {
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

async function updateWebUsers(req, res) {
  try {
    const webUser = await WebUsersModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(webUser);
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const createWebUser = (req, res) => {
  const newWebUser = new WebUsersModel({
    ...req.body,
    lifespan: new Date(Date.now() + 1460 * 24 * 60 * 60 * 1000)
  });

  newWebUser
    .save()
    .then((webuser) => res.json(webuser))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};


async function deleteWebUser(req, res) {
  try {
    const { user_id, is_deleted } = req.body;

    const deletedUser = await WebUsersModel.findByIdAndUpdate(
      user_id,
      { $set: { is_deleted: is_deleted } },
      { new: true, runValidators: true }
    );
    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function declineUser(req, res) {
  try {
    const { id } = req.params;

    const deletedUser = await WebUsersModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function checkEmailExists(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await WebUsersModel.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getWebUsers,
  getWebUser,
  updateWebUsers,
  createWebUser,
  getUsersByBranch,
  loginByEmail,
  deleteWebUser,
  declineUser,
  checkEmailExists,
  tryUpdateTTL
};
