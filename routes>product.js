const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
//const jwt_decode = require('jwt-decode');
var Buffer = require('buffer/').Buffer

const productController = require('../controller/productController');
const auth = require('../middleware/auth');

const router = express.Router();

//
router.get('/logout', (req, res) => {
  //localStorage.removeItem('token');
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

//
router.get("/productDashboard", (req, res, next) => {
  //console.log("login success..")
  res.sendFile(path.join(__dirname, '..', 'views', 'productDashboard.html'));
});

//
router.post('/productDashboard', auth.user, productController.productDashboard);

//
router.get('/addProduct', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'addProduct.html'));
});

//
router.post('/addProduct', auth.user, productController.addProduct);

//fetch data to edit
router.post('/editProduct',auth.user, productController.editProduct);

// render edit page
router.get('/editProduct/:id', (req, res, next) => {
  //console.log("login success..")
  console.log("editing id :" + req.params.id);
  res.sendFile(path.join(__dirname, '..', 'views', 'editProduct.html'));
});

//editProductmain
router.post('/editProductmain',auth.user, productController.editProductmain);

// router.post('/editProductmain', (req, res) =>{
//   var data = req.body.title;
//   console.log("data:", data);
// });

module.exports = router;
