const { publicPosts, privatePosts } = require('../db');
const postRouter = require('express').Router();
const checkAuth = require("../middleware/checkAuth")

postRouter.get('/public',(req,res)=>{
    res.json(publicPosts)
})

postRouter.get('/private',checkAuth,(req,res)=>{
        res.json(privatePosts)
    }
)


module.exports = postRouter