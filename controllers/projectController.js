const Project = require('./../models/project/project')
const catchAsyncError = require("./../middleware/catchAsyncErrors");
const request = require("./../models/request/request.js");
exports.createProject = catchAsyncError(
    async (req, res, next) => {
        try {
            const newProject = await Project.create(req.body)
            res.status(200).send(newProject);
        } catch (err) {
            res.status(200).send(err.message)
        }
    }
)

exports.fetchAllProjectRelatedToUser = catchAsyncError(
    async (req, res, next) => {
        const { projectAdmin } = req.params;
        try {
            const getProject = await Project.find({ projectAdmin: projectAdmin }).populate({ path: "projectAdmin" })
            if (!getProject) {
                res.status(400).json({ message: 'Project not found' })
            }
            res.status(200).json(getProject)

        } catch (err) {
            res.status(400).send(err.message);
        }
    }
)
var userID = [];
exports.addMember = catchAsyncError(async (req, res, next) => {
  let requestTo = req.body.requestTo;
  try {
    const projectID = await Project.findById(req.params.id);
    if (projectID) {
      const existingRequest = await request.findOne({ requestTo });
      if (existingRequest) {
        res.status(400).json("Request Already Sent To User");
      } else {
        if (!userID.includes(requestTo)) {
          userID.push(requestTo);
        }
        await request.create({
          projectAdmin: req.body.projectAdmin,
          projectId: req.body.projectId,
          requestTo: req.body.requestTo,
        });
        res.status(200).json("Request Sent");
      }
      res.end();
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});


exports.getProjectbyId=catchAsyncError(
    async(req,res,next) => {
        try{
            const getProject = await Project.findById(req.params.id).populate({path:"team.userId"})
            if(getProject){
                res.status(200).send(getProject);
            }

        }catch(err){
            res.status(404).send(err.message);
        }
    }
)
exports.getMemberInProject = catchAsyncError(
    async(req,res,next)=>{
        try {
            const userId = req.params.userId;
            const projectIdList = await Project.find({ 'team.userId': userId }).select('_id');
            const projectDetailsList = await Promise.all(projectIdList.map(async (projectId) => {
                const projectDetails = await Project.findById(projectId)
                  .populate('projectAdmin');
                return projectDetails;
              }));
            res.status(200).send(projectDetailsList);
          } catch (err) {
            console.error('Error finding projects by user ID:', err);
            res.status(500).send('Internal Server Error');
          }
    }
)
exports.add = catchAsyncError(
    async (req, res, next) => {
        try {
            const addMemberPoject = await Project.findByIdAndUpdate(req.params.id, { team:{userId:userID}  });
            res.status(200).json(addMemberPoject);
        } catch (err) {
            res.status(400).send(err.message)
        }
    }
)
exports.fetchAllProject = catchAsyncError(
    async (req, res, next) => {
        try {
            const fetchAll = await Project.find().populate({ path: "projectAdmin" })
            res.status(200).json(fetchAll)
            console.log(userID)
        } catch (err) {
            res.status(400).json(err.message)
        }
    }
)
