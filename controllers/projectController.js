const Project = require('./../models/project/project')
const catchAsyncError = require("./../middleware/catchAsyncErrors");
const request = require("./../models/request/request.js");
const requestToJoinProject = require("./../models/request/requestToJoinProject.js");
const task = require("./../models/task/task.js")
const fileUpload = require("./../models/fileUpload/fileUpload.js");
const Registration = require("./../models/Registration.js");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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
exports.addMember = catchAsyncError(async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send("Project not found");
        }

        const existingRequest = await request.findOne({ requestTo: req.body.requestTo });
        if (existingRequest) {
            return res.status(400).send("Request already sent to user");
        }

        const newRequest = await request.create({
            projectAdmin: req.body.projectAdmin,
            projectId: req.params.id,
            requestTo: req.body.requestTo,
        });

        res.status(200).json({ message: "Request sent", request: newRequest });

    } catch (err) {
        res.status(400).send(err.message);
    }
});


exports.joinProject = catchAsyncError(async (req, res, next) => {
    try {
        const { projectId, projectAdmin, jionerId } = req.body;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.projectAdmin.toString() !== projectAdmin) {
            return res.status(400).json({ error: 'Invalid project admin' });
        }

        const existingRequest = await requestToJoinProject.findOne({ projectId, projectAdmin, jionerId });

        if (existingRequest) {
            return res.status(400).json({ error: 'Request already sent' });
        }

        await requestToJoinProject.create({ projectAdmin, projectId, jionerId });

        res.status(200).json({ message: 'Request sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



exports.getProjectbyId = catchAsyncError(
    async (req, res, next) => {
        try {
            const getProject = await Project.findById(req.params.id).populate({ path: "team.userId" })
            if (getProject) {
                res.status(200).send(getProject);
            }

        } catch (err) {
            res.status(404).send(err.message);
        }
    }
)
exports.getMemberInProject = catchAsyncError(
    async (req, res, next) => {
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
exports.add = catchAsyncError(async (req, res, next) => {
    const requestID = req.params.requestID;
    try {
        const requestcheck = await request.findById(requestID);
        if (!requestcheck) {
            return res.status(404).send("Request not found");
        }

        const project = await Project.findById(requestcheck.projectId);
        if (!project) {
            return res.status(404).send("Project not found");
        }

        const existingMember = project.team.find(member => member.userId.toString() === requestcheck.requestTo.toString());
        if (existingMember) {
            await request.findByIdAndDelete(requestID);
            return res.status(400).send("User already added to project");
        }

        project.team.push({ userId: requestcheck.requestTo });
        await project.save();

        const newTask = await task.create({
            projectAdmin: project.projectAdmin,
            projectId: project._id,
            memberId: [requestcheck.requestTo],
            task: "No task assigned"
        });

        await request.findByIdAndDelete(requestID);

        res.status(200).json({ message: "User added to project", task: newTask });

    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});


exports.fetchRequestbyUserID = catchAsyncError(async (req, res, next) => {
    const userId = req.params.requestUserId;
    try {
        const requests = await request.find({ requestTo: userId }).populate({ path: "projectAdmin", select: "userName" }).populate({ path: "projectId", select: "projectName" })
        res.status(200).json(requests);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



exports.AddbyAdmin = catchAsyncError(
    async (req, res, next) => {
        const { jionerId } = req.body;
        const projectId = req.params.projectId;
        const requestId = req.params.requestId;
        try {
            const checkProject = await Project.findById(projectId);
            const checkProjectInRequest = await requestToJoinProject.findOne({ projectId: projectId }).select("projectId projectAdmin jionerId");
            if (checkProject && checkProjectInRequest) {
                projectAdminId = checkProject.projectAdmin.toString()
                projectAdminInrequest = checkProjectInRequest.projectAdmin.toString()
                if (projectAdminId != projectAdminInrequest) {
                    res.status(404).json("Project Admin are not same")
                } else {
                    const project = await Project.findById(projectId, { 'team.userId': 1 }).lean();
                    if (!project) {
                        return res.status(404).json({ message: 'Project not found' });
                    }
                    const userIds = project.team.map(member => member.userId.toString());
                    const request = await requestToJoinProject.findOne({ projectId: projectId, jionerId: jionerId });
                    if (jionerId != null) {
                        if (request && userIds.includes(request.jionerId.toString())) {
                            const deleteRequest = await requestToJoinProject.findById(requestId);
                            if (deleteRequest) {
                                deleteRequest.remove();
                            }
                            return res.status(404).json({ message: 'User is already in the team' });
                        } else {
                            const addMemberPoject = await Project.findByIdAndUpdate(projectId, { $addToSet: { team: { userId: jionerId } } });
                            const newTask = await task.create({
                                projectAdmin: projectAdminId,
                                projectId: projectId,
                                memberId: jionerId,
                                task: "no task assign"
                            });
                            if (addMemberPoject) {
                                const deleteRequest = await requestToJoinProject.findById(requestId);
                                if (deleteRequest) {
                                    deleteRequest.remove();
                                }
                            }
                            return res.status(200).json({ message: 'Member Added Succefully' });
                        }
                    } else {
                        res.status(404).json({ message: 'joiner member is invalid' })
                    }
                }
            } else {
                res.status(404).json("project not found...")
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
)


exports.fetchAllProject = catchAsyncError(
    async (req, res, next) => {
        try {
            const fetchAll = await Project.find({ projectAdmin: { $ne: req.params.id } })
                                          .populate({ path: "projectAdmin", select: "_id userName" })
            res.status(200).json(fetchAll)
        } catch (err) {
            res.status(400).json(err.message)
        }
    }
)

exports.groupChatting = catchAsyncError(
    async (req, res) => {
        const { senderId, messageText } = req.body;
        const { projectId } = req.params;
        try {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            const messageForm = {
                sender: senderId,
                text: messageText
            };
            project.chat.push(messageForm);
            project.save()
            return res.status(200).json({ message: messageForm });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
)

exports.getGroupChatting = catchAsyncError(async (req, res) => {
    const { projectId } = req.params;
    const { page = 1, limit = 10, sort, filter } = req.query;
    try {
        const project = await Project.findById(projectId)
            .populate({
                path: 'chat.sender',
                select: 'userName',
            })
            .lean();

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        let messages = project.chat;

        // Apply filtering
        //   if (filter) {
        //     messages = messages.filter((message) =>
        //       message.text.toLowerCase().includes(filter.toLowerCase())
        //     );
        //   }

        // Apply sorting
        //   if (sort) {
        //     const sortOrder = sort.startsWith('-') ? -1 : 1;
        //     const sortField = sort.slice(1);
        //     messages = messages.sort((a, b) =>
        //       a[sortField] > b[sortField] ? sortOrder : -sortOrder
        //     );
        //   }

        // Paginate the results
        //   const startIndex = (page - 1) * limit;
        //   const endIndex = page * limit;
        //   const totalResults = messages.length;
        //   messages = messages.slice(startIndex, endIndex);

        return res.status(200).json({
            chat: messages,
            // page,
            // totalPages: Math.ceil(totalResults / limit),
            // totalResults,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

exports.deleteProject = catchAsyncError(async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
        const deleteProject = await Project.deleteOne({ _id: projectId });
        res.status(200).send("Project Deleted Successfully");
    } catch (err) {
        res.status(404).send(err.message);
    }
});

exports.LeaveProject = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            const team = project.team;
            const index = team.findIndex((member) => member.userId.toString() === userId);
            if (index !== -1) {
                team.splice(index, 1);
                await project.save();
                await task.deleteOne({ memberId: userId });
                res.status(200).send("User removed from project team");
            } else {
                res.status(404).send("User not found in project team");
            }
        } else {
            res.status(404).send("Project not found");
        }
    } catch (err) {
        res.status(404).send(err.message);
    }
});

exports.fileToUpload = catchAsyncError(async (req, res, next) => {
    try {
      const checkProject = await Project.findById(req.params.projectId);
      if (!checkProject) {
        return res.status(400).send({ message: 'Project Not Found' });
      }
  
      if (checkProject.projectAdmin.toString() !== req.params.projectAdmin.toString()) {
        return res.status(400).send({ message: 'Admin not same' });
      }
  
      const userIds = checkProject.team.map((member) => member.userId.toString());
      if (!userIds.includes(req.params.memberId)) {
        return res.status(400).send({ message: 'Member not in team' });
      }
  
      const member = await Registration.findById(req.params.memberId);
      const projectName = checkProject.projectName.replace(/\s+/g, '-').toLowerCase();
      const memberName = member.userName.replace(/\s+/g, '-').toLowerCase();
      console.log(memberName)
      const memberImagesDir = path.join(__dirname, '..', 'images', projectName,memberName);
  
      if (!fs.existsSync(memberImagesDir)) {
        fs.mkdirSync(memberImagesDir, { recursive: true });
      }
  
      const storage = multer.diskStorage({
        destination: memberImagesDir,
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
        },
      });
        const files = [];
        for (const file of req.files) {
          files.push({ url: 'http://localhost:5000' + '/images/' + projectName + '/' + memberName + '/' + file.filename });
        }
  
        fileUpload.create({
          projectAdmin: req.params.projectAdmin,
          projectId: req.params.projectId,
          memberId: req.params.memberId,
          description:req.body.description,
          image: files,
        }).then(() => {
          res.status(200).send({ message: 'File upload successful' });
        }).catch((err) => {
          res.status(400).send({ message: err.message });
        });
    
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });
  exports.deleteChat = catchAsyncError(
    async (req, res) => {
        try{
            const project = await Project.findByIdAndUpdate(req.params.ProjectId,{chat:[]});
            res.status(200).json("chat deleted successfully");
        }catch(err){
            res.status(400).send({ message: err.message });
        }
    }
  )