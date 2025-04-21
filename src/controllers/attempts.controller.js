const AttemptsModel = require('../models/Attempts');
const ProgressModel = require('../models/Progress');

async function getLeaderboard(req, res) {
  try {
    const queries = {};
    const { category, level, limit, user_id, mode } = req.query;

    if(!category, !level){
      throw new Error("Category or level params not found!");
    }
    if(user_id) queries.user_id = user_id

    queries.category = category;
    queries.level = level;
    queries.mode = mode

    const attempts = await AttemptsModel
    .find(queries)
    .sort({
      correct: 'desc', 
      time_completion: 'asc',
      created_at: 'desc'
    })
    .populate("user_id")
    res.json(attempts)
  } catch (error) {
    res.status(422).json({error: error.message});
  }
}

async function addAttempt(req, res) {
  try {
    const newAttempt = new AttemptsModel(req.body.attempt);
    const attempt = await newAttempt.save();

    if(req.body.progressUserLevel){
      console.log(req.body.attempt);
      const { mode, category, user_id } = req.body.attempt
      
      const progress_data = await ProgressModel.findOneAndUpdate(
        { user_id: user_id },
        { $inc: { [`${mode}.${category}`]: 1} },
        { new: true }
      )
      console.log(progress_data);
      res.json({attempt, progress_data})
      return;
    }

    res.json(attempt);
  } catch (error) {
    res.status(422).json({error: error.message});
    console.error(error);
  }
}

module.exports = { getLeaderboard, addAttempt}