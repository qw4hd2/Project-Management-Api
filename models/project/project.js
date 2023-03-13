const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const project = new Schema({
    projectAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Registration"
    },
    team:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Registration"
            }
        }
    ],
    projectName:{
        type:String,
    },
    projectType:{
        type:String,
    },
    projectDescription:{
        type:String,
    },
    dueDate:[
        {
            day:{
                type:Number,
            },
            month:{
                type:Number,
            },
            year:{
                type:Number,
            }
        }
    ],
    initialDate:[
        {
            day:{
                type:Number,
            },
            month:{
                type:Number,
            },
            year:{
                type:Number,
            }
        }
    ],
    chat: { type: [messageSchema], default: [] }
})
module.exports=mongoose.model("project",project);