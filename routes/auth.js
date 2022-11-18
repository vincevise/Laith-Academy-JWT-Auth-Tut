const authRouter = require('express').Router();
const {check,validationResult} = require('express-validator')
const {users} = require("../db")
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
require('dotenv').config()

authRouter.post('/signup',[
    check('email','Please provide a valid email')
        .isEmail(),
    check('password','Password should be greater than 5')
        .isLength({min:6})
],async (req,res)=>{
    const { password,email } = req.body
   try{ 
        //   INPUT VALIDATION
        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({
                name:'validation',
                error: error.array()
            })
        }

        // VALIDATE IF USER DOES'NT ALREADY EXIST
        let user = users.find((x)=>x.email === email)
        if(user){
            return res.status(400).json({
                name:'already Exisit',
                error:'User already exist'
            })
        }
        
        let hashedPassword = await bcrypt.hash(password, 10)
        users.push({
            email,
            password:hashedPassword
        })
        
        const token = await JWT.sign({
            email
        },process.env.SECRET,{
            expiresIn:360000
        })
        return res.json({token})              
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            name:'catch',
            error:error})
    }
})

authRouter.post('/login',async (req,res)=>{
    const {password,email} = req.body
    try{ 
        let user = users.find((user)=>{
            return user.email === email
        })
        if(!user){
        return res.status(400).json({
            "errors":[
                    {
                        "msg":"Invalid credentials"
                    }
                ]
            })
        }

        let isMath = await bcrypt.compare(password, user.password)

        if(!isMath){
            return res.status(400).json({
                "errors":[
                    {
                        "msg":"Invalid credentials"
                    }
                ]
            })
        }

        const token = await JWT.sign({
            email
        },process.env.SECRET,{
            expiresIn:3600000
        })

        res.json({
            token
        })
        
    }catch(error){
        res.json(error)
    }

})

authRouter.get("/all",(req,res)=>{
    res.json(users)
})


module.exports = authRouter