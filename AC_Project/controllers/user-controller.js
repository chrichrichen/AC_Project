const db = require('../models')
const {User} = db
const bcrypt = require('bcryptjs')


const userController = {
  
  signUpPage:(req,res)=>{
    res.render('signup')
  },
 
  signUp: (req, res, next) => { 
    
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
   
    
    User.findOne({ where: { username: req.body.username } })
      .then(user => {
        if (user) throw new Error('Username already exists!') 
        return bcrypt.hash(req.body.password, 10) 
      })
      .then(hash => User.create({  
        username: req.body.username,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') 
        res.redirect('/signin')
      })
      .catch(err=>next(err))
  },
  
  signInPage:(req,res)=>{
    res.render('signin')
  },
  
  signIn: (req,res)=>{
    req.flash('success_messages', 'Logged in Successfully')
    res.redirect('/dashboard')
    
  },
  logout: (req,res)=>{
    req.flash('success_messages',`Logged out Successfully`)
    req.logout()
    res.redirect('/signin')
  },
  getDashboard:(req,res)=>{
  res.render('dashboard')
},

  passwordPage:(req,res)=>{
    res.render('password')
  },
   updatePassword: (req, res, next) => {
  const { oldPassword, newPassword, newPasswordCheck } = req.body;
  const { id } = req.user;

  // 檢查密碼是否匹配
  User.findOne({ where: { id } })
    .then(user => {
      if (!user) throw new Error('User not found');
      console.log('Found user:', user);

      return bcrypt.compare(oldPassword, user.password);
    })
    .then(match => {
      if (!match) throw new Error('Incorrect password');
      console.log('Password matched:', match);

      if (newPassword !== newPasswordCheck) throw new Error('Passwords do not match');

      return bcrypt.hash(newPassword, 10);
    })
    .then(hash => {
      console.log('Hashed password:', hash);

      return User.update({ password: hash }, { where: { id } });
    })
    .then(() => {
      console.log('Password updated successfully');

      req.flash('success_messages', 'Password updated successfully');
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
},



  
}

module.exports = userController