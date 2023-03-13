const Project = require("./../models/project/project.js");
exports.DeletechatbyAdmin = async(req,res,next)=>{
    const projectAdmin = req.params.projectAdmin;
    const ProjectId  = req.params.ProjectId
    try{
        const project = await Project.findById(ProjectId);
        if(!project){
            throw new Error("Project not Found")
        }
        if(project.projectAdmin.toString()!=projectAdmin){
            throw new Error("you are not authorize to Delete Group chat");
        }
        next();
    }catch(err){
        res.status(404).send(err.message)
    }
}