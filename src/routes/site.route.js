const express = require('express');
const siteController = require('../app/controllers/SiteController');
const router = express.Router();
const jwt = require('jsonwebtoken');

//[GET] home/Search
router.get('/Search', siteController.search);

//[GET] comment
router.get('/comment', siteController.comment);

//[POST] comment
router.post('/comment',(req, res, next)=> {
    var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }
} ,siteController.addComment);

//[GET] /home
router.get('/', siteController.index);

module.exports = router;
