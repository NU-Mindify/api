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

module.exports = {addSession}