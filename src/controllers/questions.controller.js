const QuestionsModel = require('../models/Questions')

async function getQuestions(req, res) {
  try {
    const queries = {};
    const { category, level, start, end } = req.query
    if(category) queries.category = category;
    if(start && end) queries.item_number = {$gte: parseInt(start), $lte: parseInt(end)}
    if(level) queries.level = level;
    console.log(queries);
    
    const questions = await QuestionsModel.find({...queries, is_deleted: false})
    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// async function getTotalQuestions(req, res){
//   try{
//     const category = req.query.category

//     const totalQuestion = await QuestionsModel.countDocuments({ category: category })
//     res.json(totalQuestion)
//     console.log(category);
    
    
//   }
//   catch(error){
//     console.log(error);
//     res.status(500).json({ error })
//   }
// }


async function getTotalQuestions(req, res) {
  try {
    const category = req.query.category;

    const totalQuestion = await QuestionsModel.aggregate([
      {
        $match: { is_deleted: false }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(totalQuestion); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}


async function addQuestion(req, res) {
  try {
    const newQuestion = new QuestionsModel(req.body);
    const question = await newQuestion.save();
    res.json(question);
  } catch (error) {
    res.status(422).json({ error })
  }
}



async function updateQuestion(req, res) {
  try {
    const update = await QuestionsModel.updateMany(
      {},
      { $set: {category: 'developmental', level: 1 }}
    );
    
    res.json(update);
  } catch (error) {
    res.status(422).json({ message: error.message })
  }
}

module.exports = { getQuestions, addQuestion, updateQuestion, getTotalQuestions }