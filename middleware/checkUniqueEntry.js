
const Registration = require('./../models/Registration');
 const checkUnique = async (req, res, next) => {
  const { userName, email } = req.body;
    const existingUser = await Registration.findOne({
        userName:userName
    })
    if (existingUser) {

      return res.status(400).json({ error: 'Username already exists' });
    }
    const existingEmail = await Registration.findOne({
        email: email
    })
    if(existingEmail){

        return res.status(400).json({ error: 'Email already exists'})
    }
    
    next();

};
module.exports = checkUnique
