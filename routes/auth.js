var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
var {validateRequest} = require('../utils/requestValidator')
const Joi = require('joi');
const User =require('../models/user');


/* Register */
router.post('/register',  async (req, res, next) => {
console.log('starting logic');
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required()
    });
    const {error,value} = validateRequest(req,res,schema);
    if(error)
    {
      return;
    }

    //validate if email is already taken
    const emailExists = await User.findOne({ email: value.email });
    if (emailExists) {
        return res.status(400).send({ success:false,message:"email is already registered"});
        
    }

     

    try{
      const user = new User();
    user.email = value.email;
    user.password =  await bcrypt.hash(value.password, 10);
    user.username = value.username;
    const newUser = await user.save();
    return res.json({ success:true,message:{userId:newUser._id}});

    }
    catch(error)
    {
      console.log('error' + error);
      return res.status(500).send({ success:false,message:"Error"});

    }
    
    
  

});

router.post('/login',  async (req, res, next) => {

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required()
});
const {error,value} = validateRequest(req,res,schema);
if(error)
{
  return;
}

try{
  const user = await User.findOne({email:value.email});
  if(!user)
  {
   return res.status(400).send({ success:false,message:"invalid user credentials"})
  }
  const validPassword = await bcrypt.compare(value.password,user.password);
  if(!validPassword)
  {
   return res.status(400).send({ success:false,message:"invalid user credentials"})
  }
 
  //at this point we are good we need to generate and send a JWT
  const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, process.env.APP_SECRET, { expiresIn: 60000 })
  return res.json({ success:true,jwt: token});
 

}
catch(err){

  console.log('error' + error);
  return res.status(500).send({ success:false,message:"Error"});

}
});


module.exports = router;


