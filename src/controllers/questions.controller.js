const QuestionsModel = require("../models/Questions");
const {
  getEmbedding,
  calculateCosineSimilarity,
} = require("../services/aiService");

async function getQuestions(req, res) {
  try {
    const queries = {};
    const { category, level, start, end, difficulty, limit } = req.query;
    if (category) queries.category = category;
    if (start && end)
      queries.item_number = { $gte: parseInt(start), $lte: parseInt(end) };
    if (level) queries.level = level;
    const aggregation = [
      {
        $match: {
          category: category,
          difficulty: difficulty,
          is_deleted: false,
          isApprove: true,
        },
      },
      {
        $sample: {
          size: parseInt(limit),
        },
      },
      {
        $project: {
          is_deleted: 0,
          isApprove: 0,
        },
      },
    ];

    if (difficulty && limit) {
      const randomQuestions = await QuestionsModel.aggregate(aggregation);
      res.json(randomQuestions);
      return;
    }

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

    const questions = await QuestionsModel.find(filter)
      .collation({ locale: "en", strength: 2 })
      .sort({ question: 1 });

    res.json(questions);
  } catch (error) {
    console.error("Error fetching unapproved questions:", error);
    res.status(500).json({ error: "Failed to fetch unapproved questions" });
  }
}

async function getTotalQuestions(req, res) {
  try {
    const category = req.query.category;

    const totalQuestion = await QuestionsModel.aggregate([
      {
        $match: { is_deleted: false, isApprove: true },
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
        $match: { is_deleted: true, isApprove: true },
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
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({ error: "Duplicate question found!" });
    }

    res.status(422).json({ error: "Unprocessable Entity" });
  }
}

async function addQuestionAdmin(req, res) {
  try {
    if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
      return res
        .status(400)
        .json({ error: "Empty body or array is not allowed" });
    }

    if (Array.isArray(req.body)) {
      const questions = await QuestionsModel.insertMany(
        req.body.map((q) => ({ ...q, isApprove: true }))
      );
      return res.status(201).json(questions);
    }

    const newQuestion = new QuestionsModel({ ...req.body, isApprove: true });
    const saveQuestion = await newQuestion.save();
    res.status(201).json(saveQuestion);
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({ error: "Duplicate question found!" });
    }

    res.status(422).json({ error: "Unprocessable Entity" });
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

async function declineQuestion(req, res) {
  try {
    const { id } = req.params;

    const deleteQues = await QuestionsModel.findByIdAndDelete(id);

    if (!deleteQues) {
      return res.status(404).json({ message: "Question not found" });
    }

    res
      .status(200)
      .json({ message: "Question deleted successfully", deleteQues });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function approveQuestion(req, res) {
  try {
    const { id } = req.params;

    const updatedQuestion = await QuestionsModel.findByIdAndUpdate(
      id,
      { isApprove: true },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({
      message: "Question approved successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error approving question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function checkQuestionSimilarity(req, res) {
  const { questionText, category } = req.body;

  if (!questionText || !category) {
    return res
      .status(400)
      .json({ error: "Question text and category are required." });
  }

  try {
    const newQuestionVector = await getEmbedding(questionText);
    if (!Array.isArray(newQuestionVector)) {
      console.error("Embedding not returned as array:", newQuestionVector);
      return res.status(500).json({ error: "Embedding service failed." });
    }

    const existingQuestions = await QuestionsModel.find({ category }).select(
      "question embedding"
    );

    let mostSimilarQuestion = null;
    let highestSimilarity = 0;

    for (const existingQuestion of existingQuestions) {
      if (
        Array.isArray(existingQuestion.embedding) &&
        existingQuestion.embedding.length === newQuestionVector.length
      ) {
        const similarity = calculateCosineSimilarity(
          newQuestionVector,
          existingQuestion.embedding
        );

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarQuestion = existingQuestion.question;
        }
      } else {
        console.warn(
          "Skipping question due to missing or mismatched embedding:",
          existingQuestion._id
        );
      }
    }

    const SIMILARITY_THRESHOLD = 0.95;
    if (highestSimilarity > SIMILARITY_THRESHOLD) {
      return res.status(409).json({
        isDuplicate: true,
        message: "This question appears to be a semantic duplicate.",
        similarQuestion: mostSimilarQuestion,
        similarityScore: highestSimilarity,
      });
    }

    res.status(200).json({ isDuplicate: false });
  } catch (error) {
    console.error("Error in Gemini similarity check:", error);
    res.status(500).json({ error: error.message || "Failed to perform AI similarity check." });
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
  declineQuestion,
  approveQuestion,
  addQuestionAdmin,
  checkQuestionSimilarity,
};
