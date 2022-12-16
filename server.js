const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./Keys')

require('./models/user')

require('./models/post')


mongoose.model("User")

// ใช้ express.json ก่อน
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb successfull")
})

mongoose.connection.on('error',(err)=>{
    console.log("error connection", err)
})

// const customMiddleware =(req,res,next)=>{
//     console.log("middleware excute")
//     next()
// }

app.get('/',(req,res) => {
    res.send("Hello world!")
    console.log("get response")
})

// app.get('/about',customMiddleware,(req,res) => {
//     res.send("this is about")
//     console.log("about response")
// })


app.listen(port,() => console.log("server connected to port",port))