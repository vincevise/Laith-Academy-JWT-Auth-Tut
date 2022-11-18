const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
require('dotenv').config()

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use("/auth",authRouter)
app.use("/posts",postRouter)



app.listen(5000,()=>console.log(`server listening on ${PORT}`))