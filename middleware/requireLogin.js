const req = require('express/lib/request')
const JWT = require('jsonwebtoken')
const {JWT_SECRET} = require('../Keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports=(req,res,next)=>{

    const {authorization} = req.headers
    if(!authorization){

        // 401 คือ ไม่มีการ authorize
        return res.status(401).json({error:"you must be login"})
    }
    const token = authorization.replace("Bearer ","")
    JWT.verify(token, JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be login"})
        }

        const {_id} = payload

            User.findById(_id).then(userdata=>{
                req.user= userdata
                next()
            })
        
    })
}