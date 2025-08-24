const ProgressModel = require("../models/Progress");

const categories = ["abnormal", 'developmental', "psychological", "industrial", "general"]

async function getUserProgress(req, res) {
  try {
    const id = req.params.id

    const userProgress = await ProgressModel.findOne({ user_id: id })
    if (userProgress){
      res.json(userProgress)
      return;
    }
    const newProgress = new ProgressModel({
      user_id: id
    })
    const progress = await newProgress.save()
    res.json(progress)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function getAllProgress(req, res) {
  try {
    const userProgress = await ProgressModel.find()
    res.json(userProgress)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function progressStory(req, res) {
  try {
    const {user_id, category, value} = req.body;
    if(!user_id || !category || !value){
      throw "Not Updated";
    }
    const newProgress = await ProgressModel.findOneAndUpdate(
      { user_id },
      {[`story.${category}`]: value},
      { new: true }
    )

    if (!newProgress) {
      throw new Error("Not Updated");
    }

    res.json(newProgress)
  } catch (error) {
    res.status(422).json(error)
  }
}

async function progressCategory(req, res) {
  try {
    const {user_id, category, mode} = req.body;
    console.log(req.body);
    const newProgress = await ProgressModel.findOneAndUpdate(
      { user_id },
      { $inc: { [`${mode}.${category}`]: 1} },
      { new: true }
    )

    if(!newProgress){
      throw new Error("Not Updated");
    }
    res.json(newProgress);

  } catch (error) {
    console.log(error);
    res.status(422).json({ message: error.message })
  }
}

module.exports = { getUserProgress, progressCategory, getAllProgress, progressStory }