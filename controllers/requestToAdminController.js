const catchAsyncError = require("./../middleware/catchAsyncErrors");
const requestToJoinProject = require("./../models/request/requestToJoinProject.js");

exports.fetchAllproject = catchAsyncError(
    async(req,res,next)=>{
        try {
            const { adminId, projectId } = req.params;
        
            const requests = await requestToJoinProject.find({ projectAdmin: adminId, projectId }).populate({
            path:"jionerId",select:"userName"});
        
            res.status(200).json(requests);
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
    }
)
