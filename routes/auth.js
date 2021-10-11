
/* Required modules */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
var { validateRequest } = require('../utils/requestValidator')
const Joi = require('joi');
const User = require('../models/user');
const auth = require('../middleware/auth')


/* POST- api/auth/Register */
router.post('/register', async (req, res, next) => {

  //validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required()
  });

  //validate request parameters based on the validation schema
  const { error, value } = validateRequest(req, res, schema);
  if (error) { return; }


  //validate if email is already taken
  const emailExists = await User.findOne({ email: value.email });
  if (emailExists) {
    return res.status(400).send({ success: false, message: "email is already registered" });
  }

  //Validations that can throw an error
  try {
    const user = new User();
    user.email = value.email;
    //encrypt password
    user.password = await bcrypt.hash(value.password, 10);
    user.username = value.username;
    //save the user into the database
    const newUser = await user.save();
    //return successfull message
    return res.json({ success: true, message: { userId: newUser._id } });

  }
  catch (error) {
    console.log('error' + error);
    return res.status(500).send({ success: false, message: error.message });

  }
});

router.post('/changePassword',auth, async (req, res, next) => {

  //validation schema
  const schema = Joi.object({
    password: Joi.string().min(5).max(30).required()
  });

  //validate request parameters based on the validation schema
  const { error, value } = validateRequest(req, res, schema);
  if (error) { return; }


  //validate if email is already taken
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(400).send({ success: false, message: "invalid update" });
  }

  //Validations that can throw an error
  try {
  
    //encrypt password
    user.password = await bcrypt.hash(value.password, 10);
    //save the user into the database

    const newUser = await user.save();
    //return successfull message
    return res.json({ success: true, message: { userId: newUser._id } });

  }
  catch (error) {
    console.log('error' + error);
    return res.status(500).send({ success: false, message: error.message });

  }
});

/* Login */
router.post('/login', async (req, res, next) => {
//validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required()
  });

  //validate request parameters based on the validation schema
  const { error, value } = validateRequest(req, res, schema);
  if (error) {return;}

  //Validations that can throw an error
  try {
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).send({ success: false, message: "invalid user credentials" })
    }
    const validPassword = await bcrypt.compare(value.password, user.password);
    if (!validPassword) {
      return res.status(400).send({ success: false, message: "invalid user credentials" })
    }

    //at this point we are good we need to generate and send a JWT
    const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, process.env.APP_SECRET, { expiresIn: 60000 })
    return res.json({ success: true, jwt: token });


  }
  catch (err) {
    console.log('error' + error);
    return res.status(500).send({ success: false, message: "Error" });
  }
});

module.exports = router;


