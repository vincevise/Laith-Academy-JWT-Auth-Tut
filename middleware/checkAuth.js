const JWT = require('jsonwebtoken')
require('dotenv').config()

module.exports = async(req,res,next) => {
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(400).json({
            "errors":[
                {
                    "msg":"No token found"
                }
            ]
        })
    }
    try{
        let user = await JWT.verify(token,process.env.SECRET)
        req.user = user.email
        next()
    }catch(error){
        res.status(400).json({
            "errors":[
                {
                    "msg":"Token invalid"
                }
            ]
        })
    }
    

}