const db = require('../models')
const {User} = db
const bcrypt = require('bcryptjs')
const passport = require('passport')

const userController = {
  
  registerPage: (req,res)=>{
    res.render('register')
  },

  register: (req,res)=>{
    bcrypt.hash(req.body.password,10)
    .then(hash => User.create({
      username: req.body.username,
      password:hash
    }))
    .then(()=>{
      res.redirect('/login')
    })
  },
  
  
  
  login: (req,res)=>{
    res.render('login')
  },

}

module.exports = userController