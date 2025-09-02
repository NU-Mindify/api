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
    const { user } = req.query; 
    const matchStage = { duration: { $exists: true, $ne: null } };
    if (user) {
      matchStage.user = { $elemMatch: { $eq: mongoose.Types.ObjectId(user) } };
    }
    const result = await SessionsModel.aggregate([
      { $match: matchStage },
      { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
    ]);
    const avgDurationMinutes = result.length > 0 ? result[0].avgDuration / 60 : 0;
    res.json({ averageSessionTimeMinutes: avgDurationMinutes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}


module.exports = {addSession, getAverageSessionTime}
