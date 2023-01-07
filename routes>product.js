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
router.post('/productDashboard', productController.productDashboard);

//
router.get('/addProduct', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'addProduct.html'));
});

//
router.post('/addProduct',auth.user, productController.addProduct);


module.exports = router;
