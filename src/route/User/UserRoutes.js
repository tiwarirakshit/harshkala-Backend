const express = require("express");
const router = express.Router();
const {userLogin,userSignUp, updateUser,userLoginWithOtp,googleAuth, googleCallback, getUserById, googleSignUp} = require('../../controller/User/UserController')
const passport = require('passport');

router.post('/login',userLogin);
router.post('/signinotp',userLoginWithOtp);
router.post('/signup',userSignUp);
router.post('/google-signup',googleSignUp);
router.post('/updateuser',updateUser);
router.post('/get-user',getUserById);

module.exports = router; 