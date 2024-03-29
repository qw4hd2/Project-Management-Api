const mongoose = require('mongoose');
const config = require('../config/auth.config');
const Registration = require('../models/Registration');
var bcrypt = require("bcryptjs");
const catchAsyncError = require("./../middleware/catchAsyncErrors");
const Project = require("./../models/project/project.js");
exports.signup = async (req, res, next) => {
    try {

        await Registration.create({
            fullName: req.body.fullName,
            userName: req.body.userName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        }).then((user) => {
            if (user) {
                res.status(200).send({
                    success: true,
                    message: "User registered succefully"
                })
            } else {
                res.status(400).send({ message: "something went wrong" })
            }
        })
    } catch (e) {
        res.status(404).send(e.message);
    }
}
exports.searchUser = catchAsyncError(async (req, res) => {
    const projectId = req.params.projectId;
    const projectAdmin = req.params.projectAdmin;
    try {
        const project = await Project.findById(projectId);
        const userName = req.query.userName;
        const users = await Registration.find({
            userName: { $regex: userName, $options: 'i' },
        },
            { _id: 1, userName: 1 }
        ).ne('_id', mongoose.Types.ObjectId(projectAdmin));
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

exports.getUser = catchAsyncError(
    async (req, res) => {
        try {
            const findUser = await Registration.findById(req.params.id, { userName: 1, _id: 1 });
            if (findUser) {
                res.status(200).json(findUser)
            }
        } catch (err) {
            res.status(400).json(err.message);
        }
    }
)