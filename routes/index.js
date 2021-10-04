var express = require('express');
var router = express.Router();
var authRouter = require('./auth');




/* GET Welcome message. */
router.get('/welcome', function (req, res, next) {
  res.json("Welcome to my API");
});

router.use('/auth',authRouter);

module.exports = router;
