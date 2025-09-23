const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.JOSH_GOOGLE_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function getEmbedding(text) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] }
  });
  return result.embedding.values;
}

function calculateCosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

module.exports = { getEmbedding, calculateCosineSimilarity };