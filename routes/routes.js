const express = require('express');
const Registration = require('../models/Registration');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { signup,searchUser,getUser } = require('./../controllers/auth.controller')
const {createProject,fetchAllProjectRelatedToUser,addMember,fetchAllProject,add,getProjectbyId,getMemberInProject,joinProject,AddbyAdmin,groupChatting,getGroupChatting,fetchRequestbyUserID,deleteProject,LeaveProject,fileToUpload,deleteChat} = require("./../controllers/projectController")
const {fetchRequestData,deleteIt} = require("./../controllers/requestController")
const {createTaskForMembers,getTaskDetail,countTotalTaskDoneByMember,fetchUploadedDocuments} = require("./../controllers/taskController")
const {fetchAllproject} = require("./../controllers/requestToAdminController.js");
const {DeletechatbyAdmin} = require("./../middleware/chatDeletebyAdmin.js");
const  checkUnique  = require("./../middleware/checkUniqueEntry")
const multer  = require("./../middleware/multer");
const router = express.Router();

router.post("/auth/signup",checkUnique ,signup);
router.post('/auth/signin', async (req, res) => {
  // Read username and password from request body
  const { email, password  } = req.body;
  const user = await Registration.findOne({
      email: email,
  })
  if (!user) {
    return res.status(404).json({ message: "invalid user! Not Registered" })
  }

  const isMatch = await bcrypt.compare(password, user.password);
 
  if (!isMatch) {
    return res.status(404).json({message:"password does not matched"})
  }
  const token =  jwt.sign({ id: user._id }, "madadgar");
  return res.status(200).json({ token: token, user: user._id });
});
router.route("/create/newProject").post(createProject);
router.route("/project/user/:projectAdmin").get(fetchAllProjectRelatedToUser);
router.route('/user/search').get(searchUser);
router.route("/project/member/:id").post(addMember);
router.route("/user/:id").get(getUser);
router.route("/fetch/fetchAllProduct").get(fetchAllProject);
router.route("/add/:requestID").post(add);
router.route("/requestData").post(fetchRequestData);
router.route("/deleteRequest/:id").delete(deleteIt);
router.route("/getProject/byAdmin/:id").get(getProjectbyId);
router.route("/task/member/:id").post(createTaskForMembers);
router.route("/fetch/task").get(getTaskDetail);
router.route("/projects/:userId").get(getMemberInProject);
router.route("/joinProject/joiner").post(joinProject);
router.route("/requesttojoin/:adminId/:projectId").get(fetchAllproject);
router.route("/admin/request/approval/:projectId/:requestId").post(AddbyAdmin);
router.route('/projects/:projectId/chat').post(groupChatting);
router.route("/getChat/:projectId/chat").get(getGroupChatting)
router.route("/request/fetch/foruser/:requestUserId").get(fetchRequestbyUserID);
router.route("/delete/project/:projectId").delete(deleteProject);
router.route("/leave/project/:id/bymember/:userId").get(LeaveProject);
router.post("/file/uploadfile/:projectId/:projectAdmin/:memberId",multer.array('image') ,fileToUpload);
router.route("/tasks/count/:memberId/:projectId").get(countTotalTaskDoneByMember);
router.route("/projects/:projectId/members/:memberId/tasks").get(fetchUploadedDocuments);
router.get("/chatDetete/projectAdmin/:projectAdmin/projectId/:ProjectId",DeletechatbyAdmin,deleteChat)
module.exports = router;