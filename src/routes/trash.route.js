const express = require('express');
const router = express.Router();
const trashController = require('../app/controllers/TrashController');

//[GET] /trash/product
router.get('/product', trashController.showProductTrashed);
//[GET] /trash/user
router.get('/user', trashController.showUserTrashed);


module.exports = router;
