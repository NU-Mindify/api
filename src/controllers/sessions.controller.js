const SessionsModel = require("../models/Sessions");

async function addSession(req, res) {
  try {
    if(!Array.isArray((req.body))){
      const session = new SessionsModel(req.body)
      const savedSession = await session.save();
      res.json({ count: savedSession.length })
      return;
    }
    const sessions = await SessionsModel.insertMany(req.body);
    res.json({ count: sessions.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}


async function getRecentSessions(req, res) {
  try {
    const { id } = req.query; 

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }


    const sessions = await SessionsModel.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10);

    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found for this user" });
    }

    res.json(sessions)

  } catch (error) {
    console.error("Error fetching average session time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



module.exports = {addSession, getRecentSessions}
