const express = require('express');
const newsController = require('../app/controllers/NewsController');
const router = express.Router();

//[GET] /new/slug
router.get('/:slug', newsController.show);

//[GET] /new
router.get('/', newsController.index);

module.exports = router;
