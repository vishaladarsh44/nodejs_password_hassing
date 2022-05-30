const dotenv= require('dotenv')
const express = require('express')
const mongoose=require('mongoose')
const app = express()


dotenv.config({path:'./config.env'});

require('./database/connection')
app.use(express.json());

//we link our router file
app.use(require('./routes/auth'))



const port = process.env.PORT;


//middleware
const middleware= (req,res,next) =>{
    console.log("hello middleware");
    next();
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/about',middleware,(req,res)=> {
    res.cookie("test" ,"newcookie")
    res.send("Hello about section")
})
app.get('/contact',middleware,(req,res)=> {
    res.send("Hello contact section")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})