const mongoose=require('mongoose')
const dotenv=require('dotenv') 

const DB=process.env.DB;

mongoose.connect(DB,{
    useUnifiedTopology: true, useNewUrlParser: true,
}).then(()=>
{
    console.log("connection sucessfull with mongodb")
}).catch((err) =>{
    console.log('connection not successfull')

})