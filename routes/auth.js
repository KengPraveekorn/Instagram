const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken')
const {JWT_SECRET} = require('../Keys')
const requiredLogin = require('../middleware/requireLogin')


router.get("/", (req, res) => {
  res.send("this is auth");
});

router.get('/permit',requiredLogin,(req,res)=>{
    res.send('you have authorization')
})

router.post("/signup", (req, res) => {
  // res.send(req.body)
  // console.log(req.body)
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "please add all field" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already exist" });
      }

      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          name,
          password: hashedpassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "saved successful" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "not found email" });
    }

    // เทียบ password in database
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //res.json({ message: "signin successfull" });
          const token = JWT.sign({_id: savedUser._id},JWT_SECRET)
          res.json({token})
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  // res.json({message:"upload successfull"})
  // console.log(req.body)
});

module.exports = router;
