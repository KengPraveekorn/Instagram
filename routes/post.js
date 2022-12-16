const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const requiredLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")


router.get('/allpost',(req,res)=>{
    // ค้นหา
    Post.find({})
        .populate("postedBy","_id name")

        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
    
})

router.get('/mypost',requiredLogin,(req,res)=>{
    // ค้นหา
    Post.find({postedBy: req.user._id})
        .populate("postedBy","_id name")

        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
    
})

router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body} = req.body

    if(!title || !body){
        return res.status(422).json({error:"Please add all field"})
    }

    req.user.password = undefined

    const post = new Post({
        title,
        body,
        postedBy: req.user
    })

    post.save().then(result=>{
        res.json({post:result})
        console.log(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router