const TermsModel = require("../models/Terms");

async function getTerms(req, res) {
  try {
    const terms = await TermsModel.find({ is_deleted: false }).sort({ word: 1 })
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
    const { term_id, word, meaning } = req.body
    const updatedTerm = await TermsModel.findByIdAndUpdate(
      term_id,
      { $set: { word, meaning }},
      { new: true, runValidators: true }
    )
    console.log("UpdateTerm:", updatedTerm);
    res.json( updatedTerm )
  } catch (error) {
    console.error("Error updating term:", error);
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getTerms, addTerm, updateTerm }