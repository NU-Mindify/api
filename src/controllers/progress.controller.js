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
      user_id: id,
      classic: categories.map(categ => ({category: categ})),
      mastery: categories.map(categ => ({category: categ})),
    })
    const progress = await newProgress.save()
    res.json(progress)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function progressCategory(req, res) {
  try {
    const {user_id, category, mode} = req.body;
    console.log(req.body);
    const newProgress = await ProgressModel.findOneAndUpdate(
      { user_id, [`${mode}.category`]: category},
      { $inc:{[`${mode}.$.level`]: 1} },
      { new: true }
    )

    if(!newProgress){
      throw new Error("Not Updated");
    }
    console.log(newProgress);
    res.json(newProgress);

  } catch (error) {
    console.log(error);
    res.status(422).json({ message: error.message })
  }
}

module.exports = { getUserProgress, progressCategory }