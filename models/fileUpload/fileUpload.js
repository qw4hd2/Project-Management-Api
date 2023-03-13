const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadTaskFile = new Schema(
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
        description:{
            type:String,
        },
        image:[{
            url:{
                type:String,
            }
        }]
    }
)
module.exports=mongoose.model('uploadTaskFile',uploadTaskFile);