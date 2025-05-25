const AttemptsModel = require('../models/Attempts');
const ProgressModel = require('../models/Progress');

async function getLeaderboard(req, res) {
  try {
    const queries = {};
    const { category, level, limit, user_id, mode } = req.query;
    console.log(req.query);
    
    if(!category || (!level && mode !== 'mastery' ) || (level && mode === 'mastery')){
      throw new Error("Category or level params not found!");
    }
    if(user_id) queries.user_id = user_id
    if(category) queries.category = category;
    if (mode) queries.mode = mode;
    if (level) queries.level = level
    
    const attempts = await AttemptsModel
    .find(queries)
    .limit(20)
    .sort({
      correct: 'desc', 
      time_completion: 'asc',
      created_at: 'desc'
    })
    .populate("user_id")
    res.json(attempts)
  } catch (error) {
    res.status(500).json({error: error.message});
    console.error(error);
  }
}

async function addAttempt(req, res) {
  try {
    console.log(req.body.attempt);
    
    const newAttempt = new AttemptsModel(req.body.attempt);
    const attempt = await newAttempt.save();
    const { mode, category, user_id, level } = req.body.attempt
    if(mode === "competition"){
      const highestScore = await AttemptsModel.findOne({user_id, category, level, mode })
        .sort({
          correct: 'desc',
          time_completion: 'asc',
          created_at: 'desc'
        })
      
      if (highestScore._id.equals(attempt._id)) {
        const updatePath = `high_scores.${category}.${parseInt(level) - 1}`;
        const progress_data = await ProgressModel.findOneAndUpdate(
          { user_id },
          { $set: { [updatePath]: req.body.attempt } },
          {new: true, upsert:true}
        );
        if(!req.body.progressUserLevel){
          console.log(progress_data);
          res.json({attempt, progress_data})
          return;
        }
      }
    }

    if(req.body.progressUserLevel){
      console.log(req.body.attempt);
      
      const progress_data = await ProgressModel.findOneAndUpdate(
        { user_id: user_id },
        { $inc: { [`classic.${category}`]: 1} },
        { new: true }
      )
      console.log(progress_data);
      res.json({attempt, progress_data})
      return;
    }

    res.json({attempt});
  } catch (error) {
    res.status(422).json({error: error.message});
    console.error(error);
  }
}

async function getTopLeaderboards(req, res) {
  try {
    const { mode } = req.query;

    if (!mode) {
      throw new Error("Mode params not found!");
    }

    // Convert modes into arrays
    const modeArray = mode.split(',');
  
    const queries = {
      mode: { $in: modeArray }  // Match any of the modes in the list
    };

    const leaderboardData = await AttemptsModel.find(queries)
      .populate('user_id')
      .limit(30)
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

module.exports = { getLeaderboard, addAttempt, getTopLeaderboards}