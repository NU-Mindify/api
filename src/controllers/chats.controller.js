const ChatsModel = require('../models/Chats')
const MessagesModel = require('../models/Messages')

async function getMessages(req, res) {
  try {
    const user_id = req.params.id
    console.log(user_id);
    
    const messages = await MessagesModel.find({ 
      $or: [
        { sender_id: user_id },
        { recepient_id: user_id }
      ]
    })
    .sort({ created_at: 1 })

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({error})
  }
}

async function deleteAllMessages(req, res) {
  try {
    const { user_id } = req.body
    console.log(user_id);

    const result = await MessagesModel.deleteMany({
      $or: [
        { sender_id: user_id },
        { recepient_id: user_id }
      ]
    })
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error })
  }
}

async function sendMessage(req, res) {
  try {
    const { user_id, message } = req.body;
    if (!message || !user_id) {
      res.status(400).json({ error: "Missing body" })
      return;
    }

    const newMessage = new MessagesModel({
      sender_id: user_id,
      content: message,
      ai_generated: false,
    })
    const messageDoc = await newMessage.save()
    console.log(messageDoc);
    
    const ai_response = await generate(message)

    const newAIMessage = new MessagesModel({
      recepient_id: user_id,
      content: ai_response,
      ai_generated: true,
    })
    const aiMessageDoc = await newAIMessage.save();
    console.log(aiMessageDoc);
    
    res.json(aiMessageDoc)
  } catch (error) {
    res.status(500).json({ error })
    console.error(error);
    
  }
}

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

async function generate(message) {
  const context = `You are a chatbot that helps psychology students. Strictly do not respond if the questions is not related to psychology. Add bulleted key points if possible. Provide a concise response to this: "${message}"`

  const result = await model.generateContent(context);
  console.log(result);
  console.log(result.response.text());
  return result.response.text();
}

module.exports = { getMessages, sendMessage, deleteAllMessages }