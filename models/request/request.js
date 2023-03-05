const mongoose = require('mongoose')
const Schema = mongoose.Schema

const request = new Schema(
    {
        projectAdmin: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Registration"
        },
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"project"
        },
        requestTo: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Registration"
        }
    }
)
module.exports=mongoose.model('request',request);