const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema


const user = new Schema({
    name : { type : String , required : true}, 
    email : {type : String , required : true}, 
    password : {type : String , required: true , select : false }
    },{
    collection : "Assignment2"
    }
)

user.methods.getSignedJwtToken = function () {
    return jwt.sign({ user_id: this._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });
  };


module.exports = mongoose.model("Assignment2", user)



