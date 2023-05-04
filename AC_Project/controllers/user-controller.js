const db = require('../models')
const {User} = db
const bcrypt = require('bcryptjs')


const userController = {
  

  
  signInPage:(req,res)=>{
    res.render('signin')
  },
  
  signIn: (req,res)=>{
    req.flash('success_messages', 'Logged in Successfully')
    res.redirect('/clocks')
    
  },
  logout: (req,res)=>{
    req.flash('success_messages',`Logged out Successfully`)
  },
  passwordPage:(req,res)=>{
    res.render('password')
  },
   updatePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const { id } = req.user;

      if (!oldPassword || !newPassword || !confirmPassword) {
        req.flash('error_messages', 'All fields are required');
        return res.redirect('/password');
      }

      if (newPassword !== confirmPassword) {
        req.flash('error_messages', 'New password and confirm password do not match');
        return res.redirect('/password');
      }

      const user = await User.findByPk(id);
      if (!user) {
        req.flash('error_messages', 'User not found');
        return res.redirect('/password');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        req.flash('error_messages', 'Old password is incorrect');
        return res.redirect('/password');
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      await user.update({ password: hash });

      req.flash('success_messages', 'Password updated successfully');
      return res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error_messages', 'Something went wrong');
      res.redirect('/password');
    }
  },
  
}

module.exports = userController