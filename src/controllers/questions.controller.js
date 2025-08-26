const QuestionsModel = require("../models/Questions");

async function getQuestions(req, res) {
  try {
    const queries = {};
    const { category, level, start, end } = req.query;
    if (category) queries.category = category;
    if (start && end)
      queries.item_number = { $gte: parseInt(start), $lte: parseInt(end) };
    if (level) queries.level = level;
    console.log(queries);


    const questions = await QuestionsModel.find({ ...queries }).limit(100);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getQuestionsWeb(req, res) {
  try {
    const queries = { isApprove: true }; 

    const { category, level } = req.query;
    if (category) queries.category = category;
    if (level) queries.level = level;

    console.log("Query filters:", queries);

    const questions = await QuestionsModel.find(queries)
      .collation({ locale: "en", strength: 2 })
      .sort({ count: -1 }); 

    res.json(questions);
  } catch (error) {
    console.error("Error fetching approved questions:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllUnapproveQuestions(req, res) {
  try {
    const { category } = req.query;

    const filter = { isApprove: false };
    if (category) {
      filter.category = category;
    }

    const terms = await QuestionsModel.find(filter).sort({ word: 1 });

    res.json(terms);
  } catch (error) {
    console.error("Error fetching unapproved terms:", error);
    res.status(500).json({ error: "Failed to fetch unapproved terms" });
  }
}



async function getTotalQuestions(req, res) {
  try {
    const category = req.query.category;

    const totalQuestion = await QuestionsModel.aggregate([
      {
        $match: { is_deleted: false },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(totalQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}




async function getTotalDeletedQuestions(req, res) {
  try {
    const category = req.query.category;

    const totalQuestion = await QuestionsModel.aggregate([
      {
        $match: { is_deleted: true },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(totalQuestion);
    console.log("Total Deleted Questions:", totalQuestion);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function addQuestion(req, res) {
  try {
    const { _id, question, meaning, tags } = req.body;

    if (req.body.length === 0) {
      return res.status(400).json({ error: "Empty array is not allowed" });
    }
    const questions = await QuestionsModel.insertMany(req.body);
    return res.status(201).json(questions);

    const newQuestion = new QuestionsModel(req.body);
    const saveQuestion = await newQuestion.save();
    res.status(201).json(saveQuestion);
  } catch (error) {
    res.status(422).json({ error });
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const {
      question,
      category,
      level,
      timer,
      difficulty,
      choices,
      rationale,
      answer,
      is_deleted,
    } = req.body;

    // if (!Array.isArray(choices) || choices.length !== 4) {
    //   return res.status(400).json({
    //     error:
    //       "Choices must be an array of exactly 4 objects with { letter, text, rationale, isCorrect }",
    //   });
    // }

    // for (const choice of choices) {
    //   if (
    //     !choice.letter ||
    //     !choice.text ||
    //     typeof choice.isCorrect !== "boolean" ||
    //     !("rationale" in choice)
    //   ) {
    //     return res.status(400).json({
    //       error:
    //         "Each choice must contain: letter, text, rationale, and isCorrect (boolean)",
    //     });
    //   }
    // }

    const updatedQuestion = await QuestionsModel.findByIdAndUpdate(
      id,
      {
        question,
        category,
        level,
        timer,
        difficulty,
        choices,
        rationale,
        answer,
        is_deleted,
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Update Question Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}




async function deleteQuestion(req, res) {
  try {
    const { question_id, is_deleted } = req.body;
    const deletedQuestion = await QuestionsModel.findByIdAndUpdate(
      question_id,
      { $set: { is_deleted } },
      { new: true, runValidators: true }
    );
    console.log("DeleteQuestion:", deletedQuestion);
    res.json(deletedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: error.message });
  }
}





module.exports = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getTotalQuestions,
  getQuestionsWeb,
  getTotalDeletedQuestions,
  getAllUnapproveQuestions,
};
