const AttemptsModel = require("../models/Attempts");
const ProgressModel = require("../models/Progress");
const WeeklyScoresModel = require("../models/WeeklyScores");

async function getLeaderboard(req, res) {
  try {
    const queries = {};
    const { category, level, limit = 20, user_id, mode, branch } = req.query;
    console.log(req.query);

    // if (
    //   !category ||
    //   (!level && mode !== "mastery") ||
    //   (level && mode === "mastery")
    // ) {
    //   throw new Error("Category or level params not found!");
    // }
    if (user_id) queries.user_id = user_id;
    if (category) queries.category = category;
    if (mode) queries.mode = mode;
    if (level) queries.level = level;
    if (branch) queries.branch = branch;

    const attempts = await AttemptsModel.find(queries)
      .limit(limit)
      .sort({
        correct: "desc",
        time_completion: "asc",
        created_at: "desc",
      })
      .populate("user_id");
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
}

async function addAttempt(req, res) {
  try {
    console.log(req.body.attempt);

    const newAttempt = new AttemptsModel(req.body.attempt);
    const attempt = await newAttempt.save();
    const { mode, category, user_id, level, points } = req.body.attempt;

    const userScore = await WeeklyScoresModel.findOneAndUpdate(
      { user_id: user_id },
      { $inc: { points: points } },
      { new: true, upsert: true }
    );

    console.log(userScore);
    

    if (mode === "competition") {
      const highestScore = await AttemptsModel.findOne({
        user_id,
        category,
        level,
        mode,
      }).sort({
        correct: "desc",
        time_completion: "asc",
        created_at: "desc",
      });

      let update = {};
      if (req.body.progressUserLevel) {
        update.$inc = { [`classic.${category}`]: 1 };
      }

      if (highestScore._id.equals(attempt._id)) {
        const updatePath = `high_scores.${category}.${level - 1}`;
        update.$set = { [updatePath]: req.body.attempt };
      }

      const progress_data = await ProgressModel.findOneAndUpdate(
        { user_id },
        update,
        { new: true, upsert: true }
      );

      res.json({ attempt, progress_data });
      return;
    }

    res.json({ attempt });
  } catch (error) {
    res.status(422).json({ error: error.message });
    console.error(error);
  }
}

async function getTopLeaderboards(req, res) {
  try {
    const { mode, category } = req.query;

    const queries = {};

    if (mode) {
      queries.mode = { $in: mode.split(",") };
    }

    if (category) {
      queries.category = { $in: category.split(",") };
    }

    if (Object.keys(queries).length === 0) {
      throw new Error("At least one of 'mode' or 'category' must be provided.");
    }

    const leaderboardData = await AttemptsModel.find(queries)
      .populate("user_id")
      .limit(30)
      .sort({
        correct: "desc",
        time_completion: "asc",
        created_at: "desc",
      });

    res.json(leaderboardData);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
}

async function getUserAttempts(req, res) {
  const { user_id } = req.query;

  try {
    if (!user_id) {
      throw new Error("User ID not Found");
    }
    const attempts = await AttemptsModel.find({ user_id });
    res.json(attempts);
  } catch (error) {
    console.log(error);
  }
}

async function getUserRecentAttempts(req, res) {
  const { user_id } = req.query;

  try {
    if (!user_id) {
      throw new Error("User ID not Found");
    }
    const attempts = await AttemptsModel.find({ user_id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getLeaderboard,
  addAttempt,
  getTopLeaderboards,
  getUserAttempts,
  getUserRecentAttempts,
};
