const Badges = require('../models/Badges')
const UserBadges = require('../models/UserBadges')
const Users = require('../models/Users');

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

async function getAllBadges(req, res) {
  try {
    const badges = await Badges.find()
    res.json(badges)
  } catch (error) {
    res.status(500).json({error})
  }
  
}

async function getTopEarnedBadges(req, res) {
  try {
    const totalUsers = await Users.countDocuments({ is_deleted: false });

    const topBadges = await UserBadges.aggregate([
      { $group: { _id: "$badge_id", count: { $sum: 1 }, users: { $addToSet: "$user_id" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "badges",
          localField: "_id",
          foreignField: "_id",
          as: "badge"
        }
      },
      { $unwind: "$badge" }
    ]);

   
    const formatted = topBadges.map(b => {
      const usersWithBadge = b.users.length;
      const percentage = totalUsers > 0 ? ((usersWithBadge / totalUsers) * 100).toFixed(2) : "0.00";
      return {
        id: b._id,
        count: b.count,
        name: b.badge.category + " Lv." + b.badge.level,
        iconUrl: b.badge.filepath,
        percentage: Number(percentage)
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error in getTopEarnedBadges:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addBadge, addUserBadge, getUserBadges, getAllBadges, getTopEarnedBadges }