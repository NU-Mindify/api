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

async function getAverageSessionTime(req, res) {
  try {
    const result = await SessionsModel.aggregate([
      { $match: { duration: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
    ]);
    const avgDuration = result.length > 0 ? result[0].avgDuration : 0;
    res.json({ averageSessionTime: avgDuration });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
rs

module.exports = {addSession, getAverageSessionTime}
