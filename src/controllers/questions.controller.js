const QuestionsModel = require('../models/Questions')

async function getQuestions(req, res) {
  try {
    const queries = {};
    const { category, level, start, end } = req.query
    if(category) queries.category = category;
    if(start && end) queries.item_number = {$gte: parseInt(start), $lte: parseInt(end)}
    if(level) queries.level = level;
    console.log(queries);
    
    const questions = await QuestionsModel.find({...queries})
    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: error.message })
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
async function deleteQuestion(req, res) {
  try {
    const { question_id, is_deleted } = req.body
    const deletedQuestion = await QuestionsModel.findByIdAndUpdate(
      question_id,
      { $set: { is_deleted }},
      { new: true, runValidators: true }
    )
    console.log("DeleteQuestion:", deletedQuestion);
    res.json( deletedQuestion )
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getQuestions, addQuestion, updateQuestion, deleteQuestion }