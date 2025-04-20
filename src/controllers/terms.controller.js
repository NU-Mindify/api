const TermsModel = require("../models/Terms");

async function getTerms(req, res) {
  try {
    const terms = await TermsModel.find().sort({ word: 1 })
    res.json(terms)
    console.log(req.body);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
}

async function addTerm(req, res) {
  try {
    const newTerm = new TermsModel(req.body);
    const term = await newTerm.save()
    res.json(term)
  } catch (error) {
    console.log(error);
    res.status(422).json({ message: error.message })
  }
}

async function updateTerm(req, res) {
  try {
    const update = await TermsModel.updateMany(
      {},
      { $set: {word: "", meaning: ""}}
    );
    
    res.json(update);
  } catch (error) {
    res.status(422).json({ message: error.message })
  }
}

module.exports = { getTerms, addTerm, updateTerm }