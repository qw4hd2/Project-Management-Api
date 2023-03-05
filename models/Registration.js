const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

   
    userName: { type: String, required: [true, "Enter Your user name"],unique: true, trim: true},

    email: {
        type: String,
        // maxlength: [8, 'Price cannot exceeds 8 character']
        required: [true,"Enter Your email address"],
        unique: true, 
        trim: true
    },

    

    password: {
        type: String,
        required: [true, "Enter your password"]

    },
   
});

module.exports = mongoose.model("Registration", userSchema)