const LogsModel = require('../../models/web/Logs');


async function getLogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await LogsModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LogsModel.countDocuments();

    res.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const addLogs = (req, res) => {
    const newLogs = new LogsModel(req.body);
    newLogs.save()
     .then(newlogs => res.json(newlogs))
     .catch(err=>{
        console.log(err);
        res.status(500).json({error: "Internal Server Error"})
     })
}






module.exports = { getLogs, addLogs }