const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestToJoinProject = new Schema(
    {
        projectAdmin: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Registration"
        },
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"project"
        },
        jionerId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Registration"
        }
    }
)
module.exports=mongoose.model('requestToJoinProject',requestToJoinProject);