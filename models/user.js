const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },

},{timestamps:true});

const User = mongoose.model('User',schema);
module.exports = User;