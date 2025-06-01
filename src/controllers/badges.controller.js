const Badges = require('../models/Badges')
const UserBadges = require('../models/UserBadges')

async function addBadge(req, res) {
  try {
    const newBadge = new Badges(req.body);
    const savedBadge = await newBadge.save();
    console.log(savedBadge);
    res.json(savedBadge);
  } catch (error) {
    console.error(error);
    res.status(500).json({error})
  }
}

async function addUserBadge(req, res) {
  try {
    const {category, level, user_id} = req.body;
    const badge = await Badges.findOne({category, level})

    const newUserBadge = await new UserBadges({user_id, badge_id: badge._id}).save()
    console.log(newUserBadge);
    res.json({badge})
  } catch (error) {
    res.status(500).json({error})
  }
}

async function getUserBadges(req, res){
  try {
    const {user_id} = req.query;
    const badges = await UserBadges.find({user_id}).populate('badge_id')
    res.json(badges)
  } catch (error) {
    console.error(error);
    res.status(500).json({error})
  }
}

module.exports = { addBadge, addUserBadge }