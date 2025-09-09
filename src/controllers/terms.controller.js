const TermsModel = require("../models/Terms");

async function getTerms(req, res) {
  try {
    const terms = await TermsModel.find({ is_deleted: false })
      .collation({ locale: "en", strength: 2 })
      .sort({ word: 1 });

    res.json(terms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function getDeletedTerms(req, res) {
  try {
    const terms = await TermsModel.find({ is_deleted: true }).sort({ word: 1 });

    res.json(terms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function getLatestUpdatedTerm(req, res) {
  try {
    const term = await TermsModel.findOne({is_deleted: false}).sort({updatedAt: -1})
    res.json(term)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function getLimitedTerms(req, res) {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const terms = await TermsModel.find({ is_deleted: false })
      .collation({ locale: "en", strength: 2 })
      .sort({ word: 1 })
      .skip(start)
      .limit(limit);

    res.json(terms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


async function addTerm(req, res) {
  try {
    const newTerm = new TermsModel(req.body);
    const term = await newTerm.save();
    res.json(term);
  } catch (error) {
    console.log(error);
    res.status(422).json({ message: error.message });
  }
}

async function updateTerm(req, res) {
  try {
    const { term_id, word, meaning, tags } = req.body;
    const updatedTerm = await TermsModel.findByIdAndUpdate(
      term_id,
      { $set: { word, meaning, tags } },
      { new: true, runValidators: true }
    );
    console.log("UpdateTerm:", updatedTerm);
    res.json(updatedTerm);
  } catch (error) {
    console.error("Error updating term:", error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteTerm(req, res) {
  try {
    const { term_id, is_deleted } = req.body;
    const deletedTerm = await TermsModel.findByIdAndUpdate(
      term_id,
      { $set: { is_deleted } },
      { new: true, runValidators: true }
    );
    console.log("DeleteTerm:", deletedTerm);
    res.json(deletedTerm);
  } catch (error) {
    console.error("Error updating term:", error);
    res.status(500).json({ error: error.message });
  }
}

async function unarchiveTerm(req, res) {
  try {
    const { term_id, is_deleted } = req.body;
    const deletedTerm = await TermsModel.findByIdAndUpdate(
      term_id,
      { $set: { is_deleted } },
      { new: true, runValidators: true }
    );
    console.log("DeleteTerm:", deletedTerm);
    res.json(deletedTerm);
  } catch (error) {
    console.error("Error updating term:", error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = { getTerms, addTerm, updateTerm, deleteTerm, getLimitedTerms, getDeletedTerms, getLatestUpdatedTerm, unarchiveTerm };
