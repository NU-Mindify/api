const AttemptsModel = require("../../models/Attempts");

async function getAnalytics(req, res) {
  try {
    const { categories, levels, mode } = req.query;

    if (!categories || !mode) {
      throw new Error("Categories or mode params not found!");
    }

    // Convert to arrays
    const categoryArray = categories.split(",");
    const levelArray = levels ? levels.split(",") : [];
    const modeArray = mode.split(",");

    const queries = {
      category: { $in: categoryArray },
      mode: { $in: modeArray },
    };

    // Only include level filter if not all selected modes are 'mastery'
    if (!modeArray.includes("mastery") || modeArray.length > 1) {
      queries.level = { $in: levelArray };
    }

    const leaderboardData = await AttemptsModel.find(queries)
      .populate("user_id")
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

module.exports = { getAnalytics };
