require("dotenv").config();
const mongoose = require("mongoose");
const QuestionsModel = require("../src/models/Questions");
const { getEmbedding } = require("../src/services/aiService");

async function backfillEmbeddings() {
  await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  // Find questions with missing or empty embeddings
  const questions = await QuestionsModel.find({
    $or: [
      { embedding: { $exists: false } },
      { embedding: { $size: 0 } }
    ]
  });

  console.log(`Found ${questions.length} questions to update.`);

  for (const q of questions) {
    try {
      // Generate embedding for the question text
      q.embedding = await getEmbedding(q.question);
      await q.save();
      console.log(`Updated embedding for question: "${q.question}"`);
    } catch (err) {
      console.error(`Failed to update question "${q.question}":`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("Embedding backfill complete!");
}

backfillEmbeddings();