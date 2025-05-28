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

const addBranches = (req, res) => {
    const newBranches = new BranchesModel(req.body)
    newBranches.save()
     .then(newbranches => res.json(newbranches))
     .catch(err=>{
        console.log(err);
        res.status(500).json({err})
     })
}

module.exports = { getBranches, addBranches }