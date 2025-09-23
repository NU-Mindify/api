const mongoose = require('mongoose')

const choiceSchema = new mongoose.Schema({
  letter: {
    type: String,
    enum: ["a", "b", "c", "d"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  rationale: String,
  isCorrect: {
    type: Boolean,
    default: false
  }
}, { _id: false })

const QuestionsSchema = new mongoose.Schema({
  category:{
    type:String,
    enum: ["abnormal", "developmental", "psychological", "industrial", "general"]
  },
  level: Number,
  question:{
    type: String,
    unique: true,
  },
  timer:{
    type: Number,
    required: true
  },
  difficulty:{
    type: String,
    require: true,
    enum:['easy', 'average', 'difficult']
  },
  item_number: {
    type: Number,
    required: true
  },
  choices: [choiceSchema],
  rationale: String,
  answer:{
    type:String,
    enum:["a", "b", "c", "d"]
  },
  ytlink:String,
  image:String,
  is_deleted: {
    type: Boolean,
    default: false
  },
  isApprove: {
    type: Boolean,
    default: false
  },
  embedding: {
    type: [Number],
    default: []
  }
}, {timestamps: true})

QuestionsSchema.pre('save', async function(next) {
  if (this.isModified('question')) {
    try {
      console.log(`[pre-save] Generating embedding for: "${this.question}"`);
      this.embedding = await getEmbedding(this.question);
    } catch (error) {
      console.error('Failed to generate embedding on save:', error);
    }
  }
});

const QuestionsModel = mongoose.model("questions", QuestionsSchema)

module.exports = QuestionsModel;