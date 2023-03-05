const catchAsyncError = require("./../middleware/catchAsyncErrors");
const request = require("./../models/request/request");

exports.fetchRequestData = catchAsyncError(
    async(req, res, next) =>{
        const{requestTo}=req.body;
        try{
            const fetchRequestData = await request.find({requestTo:requestTo}).populate({path:"projectAdmin"}).populate({path:"projectId"})
            res.status(200).json(fetchRequestData)
        }catch(err){
            res.status(400).send(err.message)
        }
    }
)
exports.deleteIt = catchAsyncError(
    async(req,res) => {
        try{
            const deleteRequest = await request.findById(req.params.id);
            deleteRequest.remove()
            res.status(200).send("Deleted successfully");
        }catch(err){
            res.status(400).send(err.message)
        }
    }
)