const mongoose=require('mongoose');
const config = require("./../config/auth.config");
const jwt = require ("jsonwebtoken")

verifyToken = async(req ,res) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
          message: "No token provided!"
        });
      }
    
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!"
          });
        }
        req.userId = decoded.id;
        next();
      });
};
const authjwt = {
    verifyToken: verifyToken,
  };
  module.exports = authjwt;