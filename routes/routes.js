const express = require('express');
const Registration = require('../models/Registration');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const config = require("./../config/auth.config")
const { signup,searchUser,getUser } = require('./../controllers/auth.controller')
const {createProject,fetchAllProjectRelatedToUser,addMember,fetchAllProject,add,getProjectbyId,getMemberInProject} = require("./../controllers/projectController")
const {fetchRequestData,deleteIt} = require("./../controllers/requestController")
const {createTaskForMembers,getTaskDetail} = require("./../controllers/taskController")
const  checkUnique  = require("./../middleware/checkUniqueEntry")
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
router.route("/add/:id").post(add);
router.route("/requestData").post(fetchRequestData);
router.route("/deleteRequest/:id").delete(deleteIt);
router.route("/getProject/byAdmin/:id").get(getProjectbyId);
router.route("/task/member/:id").post(createTaskForMembers);
router.route("/fetch/task").get(getTaskDetail);
router.route("/projects/:userId").get(getMemberInProject);
module.exports = router;