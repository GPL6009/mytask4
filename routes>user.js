const express = require('express');
const path = require('path');

const userController = require('../controller/userController');
const router = express.Router();


router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'..','views','register.html'));
});

//following to insert
router.post('/', userController.add_user);

//following email exists
router.post('/emailCheck', userController.email_exists);

//
router.get("/login",(req,res,next)=>{
  res.sendFile(path.join(__dirname,'..','views','login.html'));
});

//
router.post('/login',userController.user_login);

module.exports =  router;
 
