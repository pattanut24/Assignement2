const mongoose = require('mongoose')

const Schema = mongoose.Schema
const todo = new Schema({
    order : { type : Number , default : 1 }, 
    title : {type : String , required : true }, 
    createdAt : { type : String , default : Date.now() }
    },{
    collection : "Assignment2_todo"
    }
)

module.exports = mongoose.model("Assignemnt2", todo )