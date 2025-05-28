const LogsModel = require('../../models/web/Logs');

async function getLogs(req,res) {
    try{
        const logs = await LogsModel.find();
        res.json(logs)
    }catch (error){
        console.log(error);
        res.status(500).json({error})
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