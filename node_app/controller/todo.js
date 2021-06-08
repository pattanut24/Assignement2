const express = require('express')
const todomodel = require('../../db/schema/todo')

const router = express.Router() 

router.post('/todos', async(req,res)=>{
    try{
        var user = req.user 
        var body = req.body
        if (!user){
            res.status(400).json({
                success :false , 
                error : "Invalid user"
            })
        }
        
        if (!body.title){
            res.status(400).json({
                success :false, 
                error : 'Title not found'
            })
        }

        var maxorder = await todomodel.find({} , {order:1 , _id:0}).sort({order:-1}).limit(1)
        maxorder = maxorder.length === 0 ? 0 : Number(maxorder[0].order+1)

        var id = await todomodel.create({
            title : body.title, 
            order : maxorder, 
        })
        res.status(200).json({
            success : true , 
            data: id 
        })
    }catch(err){
        res.status(400).json({
            success : false , 
            error : err.message 
        })
    }
})

router.put('/todos/:id', async(req,res)=>{
    try{
        var params = req.params.id 
        var body = req.body 
        if (!body.title){
            return res.status(400).json({
                success :false, 
                error : "Title not found"
            })
        }
        var id = await todomodel.findByIdAndUpdate(params,{
            title: body.title
        },{new : true})
        res.status(200).json({
            success: true , 
            data: id 
        })

    }catch(err){
        res.status(400).json({
            success: false,
            error : err.message
        })
    }
})

router.delete('/todos/:id', async(req,res)=>{
    try{
        var params = req.params.id 
        await todomodel.deleteOne({_id : params}) 
        res.status(200).json({
            success: true , 
            data:{} 
        })
    }catch(err){
        res.status(400).json({
            success: false , 
            error : err.message
        })
    }
})
module.exports = router 