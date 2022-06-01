const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("../database/connection");
const User = require("../models/userschema");



router.get('/', (req, res) => {
  res.send('Hello World! from routes ')
})
router.post('/register', async (req, res) => {

  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "PLZ fill the correct form" })

  }

  try {

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" })
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password mismatch" })
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const userRegister = await user.save()

      if (userRegister) {
        res.status(201).json({ message: "user registered succesfully" })
      }
      else {
        res.status(500).json({ error: "there is some problem" })
      }

    }





  }
  catch (err) {
    console.log(err);

  }

})


router.get('/user', async (req,res) => {
  User.User.find({}).exec((err,docs) => {
    if(err)throw (err);
    res.json(docs);
  })
  
})
router.get('/class', async (req,res) => {
  User.Class.find({}).populate("students")
  .exec((err,docs) => {
    if(err)throw (err);
    res.json(docs);
  })
  
})

//to post
router.post('/class' ,async (req,res) =>{
console.log(req.body);
let cl=new User.Class();
cl.name = req.body.name;
cl.students =[] ;
cl.save((err) => {
  if(err) res.json({"error": err})
  else res.json(cl)
})
})

//to update 
router.put('/class/:id' ,async (req,res) =>{

  User.Class.findOneAndUpdate({_id:req.params.id}, {$push:{students:req.body.studentId}},{new:true},(err,doc) =>{
    if(err) throw(err);
    else res.json(doc);
  })

})

//Using Promises

// router.post('/register', (req, res) => {

//   const { name, email, phone, work, password, cpassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "PLZ fill the correct form" })

//   }

//   User.findOne({ email: email }).
//     then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exist" })
//       }

//       const user = new User({ name, email, phone, work, password, cpassword });

//       user.save().then(() => {
//         res.status(201).json({ message: "user registered succesfully" })
//       }).catch((err) => {
//         res.status(500).json({ error: "there is some problem" })
//       })
//     }).catch(err =>{
//       console.log(err);
//     })

// }) 


router.post('/login', async (req, res) => {

  // console.log(req.body);
  // res.json({messsage:"Awesome"});
  try {

    const { email, password, } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "PLZ fill email/password" })
    }

    const loginuser = await User.findOne({ email: email });

    // console.log(loginuser.password)

    if (loginuser) {
      const isMatch = await bcrypt.compare(password, loginuser.password)

      const token =await loginuser.generateAuthToken();
      console.log(token); 

      res.cookie("jwtoken", token,{
        expires  :new Date(Date.now() + 25892000000 ),
        httpOnly :true
      }
      
      )

      if (!isMatch) {
        return res.status(422).json({ error: "invalid credential" })
      } else {
        return res.json({ message: "login successfull" , token : token})
      }
    } else {
      return res.status(422).json({ error: "invalid credential" })
    }

    // if(loginuser.password != password){
    //   return res.status(422).json({ error: "wrong email/password" })
    // }

  } catch (err) {
    console.log(err);
  }




})

module.exports = router;
 // const {email,password,} = req.body;
  // if (!email ||!password) {
  //   return res.status(422).json({ error: "PLZ fill email/password" })
  // }







//json format data
//   {
//     "name":"adarsh",
//     "email":"adarsh@gmail.com",
//     "phone":9590230450,
//     "work":"work dev",
//     "password":"adarsh123",
//     "cpassword":"adarsh123"
// }