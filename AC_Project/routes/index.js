const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const dashboardController = require('../controllers/dashboard-controller')
const passport = require('../config/passport')

const user = require('./modules/users')

router.get('/dashboard', dashboardController.getDashboard)





router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),(req, res, next) => {
  console.log('User authenticated:', req.user)
  next()
},userController.signIn)

router.get('/logout', userController.logout)

router.get('/password',userController.passwordPage)
router.post('/password',userController.updatePassword)

router.use('/', (req, res) => res.redirect('/signin'))


module.exports = router