const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://madadgar:madadgar123@cluster0.xsp6b4n.mongodb.net/Fyp_project",
        {
            useNewUrlParser: true

        }).then((data) => {
            console.log(`Mongodb is connected with the server: ${data.connection.host}`);
        }).catch((err) => {
            console.log(err);
        })
}

module.exports = connectDatabase;