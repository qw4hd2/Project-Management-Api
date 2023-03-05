const catchAsyncError = require("./../middleware/catchAsyncErrors");
const task = require('./../models/task/task')
const Project = require("./../models/project/project")
exports.createTaskForMembers = catchAsyncError(
    async (req, res, next) => {
        const { memberId, task: taskDescription } = req.body;

        try {
            // check if the project exists
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // check if the member exists in the project
            const member = project.team.find(member => member.userId.toString() === memberId);
            if (!member) {
                return res.status(404).json({ message: 'Member not found in project' });
            }

            // check if the task already exists for the member in the project
            const existingTask = await task.findOne({ projectId: project._id, memberId });

            if (existingTask) {
                existingTask.task = taskDescription;
                await existingTask.save();

                res.status(200).json({
                    message: 'Task updated',
                    task: existingTask
                });
            } else {
                const newTask = await task.create({
                    projectAdmin: req.body.projectAdmin,
                    projectId: project._id,
                    memberId,
                    task: taskDescription
                });

                res.status(200).json({
                    message: 'Task assigned',
                    task: newTask
                });
            }
        }catch (err) {
            res.status(500).send(err.message);
        }
    }
);


exports.getTaskDetail = catchAsyncError(async (req, res, next) => {
    const { projectId, memberId } = req.query;
    try {
      const tasks = await task.find({ projectId: projectId, memberId: memberId }).populate({
        path: "memberId",
        select:"task",
      }).populate({path:"projectAdmin"}).populate({path:"projectId"});
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
