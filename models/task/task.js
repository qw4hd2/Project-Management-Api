const mongoose = require('mongoose')
const Schema = mongoose.Schema

const task = new Schema(
    {
        projectAdmin: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Registration"
        },
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"project"
        },
        memberId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Registration"
        },
        task:{
            type:String,
        }
    }
)
module.exports=mongoose.model('task',task);