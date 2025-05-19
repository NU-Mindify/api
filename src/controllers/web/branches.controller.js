const BranchesModel = require('../../models/web/Branches');

async function getBranches(req, res){
    try{
        const branches = await BranchesModel.find()
        res.json(branches)
    } catch (error){
        console.log(error);
        res.status(500).json({error})
    }
}

module.exports = { getBranches }