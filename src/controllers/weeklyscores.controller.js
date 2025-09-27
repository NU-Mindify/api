const WeeklyScoresModel = require("../models/WeeklyScores")

async function addWeeklyScore(req, res) {
  const { user_id, newScore } = req.body;

  try {
    const userScore = await WeeklyScoresModel.findOneAndUpdate(
      { user_id: user_id },
      { $inc: { points: newScore } },
      { new: true, upsert: true }
    );

    if (userScore) {
      res.status(200).json({ message: 'Score updated successfully', userScore });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getWeeklyLeaderboard(req, res) {
  try {
    const leaderboard = await WeeklyScoresModel.find()
      .sort({ points: -1 })
      .limit(50)
      .populate("user_id", "branch username avatar cloth title")
      .lean()
      .exec()
      
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { addWeeklyScore, getWeeklyLeaderboard }