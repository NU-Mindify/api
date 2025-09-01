const BranchesModel = require('../../models/web/Branches');

async function getBranches(req, res){
    try{
        const branches = await BranchesModel.find({is_deleted: false})
        res.json(branches)
    } catch (error){
        console.log(error);
        res.status(500).json({error})
    }
}

async function getDeleteBranches(req, res){
    try{
        const branches = await BranchesModel.find({is_deleted: true})
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

const deleteBranch = async (req, res) => {
  try {
    const {branchId, is_deleted} = req.body;

    const deletedBranch = await BranchesModel.findByIdAndUpdate(
        branchId, 
        { is_deleted }, 
        { new: true }
    );

    if (!deletedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(deletedBranch);
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = { getBranches, addBranches, getDeleteBranches, deleteBranch }