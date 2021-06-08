const express =require('express')
const bcrypt = require('bcrypt')
// const usermodel = require('../../db/schema/user')
const { authenticateToken } = require('../../shared/auth')
const router = express.Router() 

router.post('/register' , async(req,res)=>{
    var body =req.body 

    if (!body.password || !body.email || !body.name){
        return res.status(400).json({
            success : false, 
            error : "Invalid name or email or password"
        })
    }

    const u = await req.db.User.find({ email : body.email })

    if (u.length !== 0){
        return res.status(400).json({ 
            success : false , 
            error : 'Email already exist'})
    }

    const salt = await bcrypt.genSalt(10); 

    var id = await req.db.User.create({
        name : body.name , 
        email : body.email, 
        password : await bcrypt.hash(body.password, salt)
    })
    var token = id.getSignedJwtToken()

    res.status(200).json({
        success : true, 
        token : token 
    })
})

router.post('/login', async(req,res)=>{
    var body = req.body 

    if (!body.password || !body.email){
        return res.status(400).json({
            success:false, 
            error : "Empty email or password"
        })
    }

    const u = await req.db.User.findOne({ email : body.email}).select('password')

    if (u === null){
        return res.status(400).json({
            success:false, 
            error:"Invalid Email"
        })
    }
    
    const validPassword = await bcrypt.compare(body.password , u.password)

    if (!validPassword){
        return res.status(400).json({
            success:false, 
            error:"Invalid Password"
        })
    }
    
    var token = u.getSignedJwtToken()
    res.status(200).cookie('token',token).json({
        success:true , 
        token :token 
    })

})

router.post('/logout' , authenticateToken,  async(req,res)=>{
    let user = req.user 

    if (!user){
        res.status(400).json({
            success: false , 
            error : "Invalid user"
        })
    }

    const id = await req.db.User.findById(user.user_id)

    res.status(200).clearCookie('token').json({
        success: true , 
        data :id 
    })

})

module.exports = router 