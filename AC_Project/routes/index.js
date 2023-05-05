const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const attendanceController = require('../controllers/attendance-controller')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')



router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), (req, res, next) => {
  console.log('User authenticated:', req.user)
  next()
}, userController.signIn)

router.get('/logout', userController.logout)


router.get('/dashboard', authenticated,userController.getDashboard)
router.post('/dashboard/attendance/clockin', authenticated, attendanceController.clock_in)
router.post('/dashboard/attendance/clockout', authenticated, attendanceController.clock_out)




router.get('/dashboard/password',authenticated, userController.passwordPage)
router.post('/dashboard/password',authenticated, userController.updatePassword)

router.use('/', (req, res) => res.redirect('/signin'))
router.use('/', generalErrorHandler)

module.exports = router
