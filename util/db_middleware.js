const User = require('../db/schema/user')

module.exports = (req,res,next)=>{
    req.db= { User : User}
    next() 
}