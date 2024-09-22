const express = require('express');
const router = express.Router();
const storedController = require('../app/controllers/StoredController');

//[GET] /stored/product
router.get('/product', storedController.showProduct);
//[GET] /stored/product
router.get('/user', storedController.showUser);

//[GET] /stored
router.get('/', storedController.index);

module.exports = router;
