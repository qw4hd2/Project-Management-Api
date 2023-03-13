const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Project = require('./../models/project/project.js');
const Registration = require("./../models/Registration.js");

const fileStorageEngine = multer.diskStorage({
  destination: async (req, file, cb) => {
    const projectId = req.params.projectId;
    const memberId = req.params.memberId;
    try {
      // Check if the project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return cb(new Error('Project does not exist'));
      }

      const getProject = await Registration.findById(memberId);
      const member = project.team.find((member) => member.userId.toString() === memberId.toString());
      if (!member) {
        return cb(new Error('Member does not exist in the project team'));
      }
      const projectName = project.projectName.replace(/\s+/g, '-').toLowerCase();
      const memberName = getProject.userName.replace(/\s+/g, '-').toLowerCase();
      const memberDir = path.join(__dirname, '..', 'images', projectName, memberName);

      if (!fs.existsSync(memberDir)) {
        fs.mkdirSync(memberDir, { recursive: true });
      }
      cb(null, memberDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

module.exports = multer({ storage: fileStorageEngine });
