const express = require('express');
const errorMiddleware = require("./middleware/error")
const app = express();
const cors=require("cors");

const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.static('images'));
app.use('/images', express.static('images'));

//Routes Imports
const routes = require('./routes/routes');

app.use("/api", routes)
app.use(express.urlencoded({ extended: true }));
//Middleware for Errors
app.use(errorMiddleware);


module.exports = app;