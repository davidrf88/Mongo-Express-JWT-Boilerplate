var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var cors = require('cors')
require('dotenv').config();

var app = express();
//cors 
app.use(
  cors({
    origin: '*'
  })

)
console.log('connecting to database');
mongoose.connect(process.env.MongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err,param2) {
  if (err) throw err;
  else
  console.log("connection succeed")
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', indexRouter);

module.exports = app;
