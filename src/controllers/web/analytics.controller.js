const AttemptsModel = require('../../models/Attempts')

async function getAnalytics(req, res) {
    try {
      const { categories, levels, mode } = req.query;
  
      if (!categories || !levels) {
        throw new Error("Categories or levels params not found!");
      }
  
      // Convert categories and levels into arrays
      const categoryArray = categories.split(',');
      const levelArray = levels.split(',');
      const modeArray = mode.split(',');
    
      const queries = {
        category: { $in: categoryArray }, // Match any of the categories in the list
        level: { $in: levelArray },       // Match any of the levels in the list
        mode: { $in: modeArray }          // Match any of the modes in the list
      };
  
      const leaderboardData = await AttemptsModel.find(queries)
        .populate('user_id')
        .sort({
          correct: 'desc',
          time_completion: 'asc',
          created_at: 'desc'
        });
  
      res.json(leaderboardData);
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  }

module.exports = {getAnalytics}