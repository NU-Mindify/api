const LogsModel = require('../../models/web/Logs');


async function getLogs(req, res) {
  try {
    const { page, limit, action, month, startDate, endDate } = req.query;

    let filter = {};

    if (action) filter.action = action;

    // Month filter
    if (month && !(startDate && endDate)) {
      const monthIndex = new Date(`${month} 1, 2025`).getMonth();
      filter.createdAt = {
        $gte: new Date(2025, monthIndex, 1),
        $lt: new Date(2025, monthIndex + 1, 1),
      };
    }

    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const logs = await LogsModel.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await LogsModel.countDocuments(filter);

    res.json({ logs, total });
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