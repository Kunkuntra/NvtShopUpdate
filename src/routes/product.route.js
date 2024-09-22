const express = require('express');
const productController = require('../app/controllers/ProductController');
const router = express.Router();
const jwt = require('jsonwebtoken');

//[GET] /product/create
router.get('/create', (req, res, next)=>{
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

}, (req, res, next)=>{
    var token = req.cookies.token;
    var result = jwt.verify(token, 'mk');
    if (!result.admin){
        res.json('Bạn không đủ quyền' )
    }
    next();

}, productController.create);

//[POST] /product/store
router.post('/store', productController.store);

//[GET] /product/:id/edit
router.get('/:id/edit', (req, res, next)=>{
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

}, (req, res, next)=>{
    var token = req.cookies.token;
    var result = jwt.verify(token, 'mk');
    if (!result.admin){
        res.json('Bạn không đủ quyền' )
    }
    next();

}, productController.edit);

//[POST] /product/handle-form-actions
router.post('/handle-form-actions', productController.handleFormActions);

//[PUT] /product/:id
router.put('/:id', productController.update);

//[DELETE] /product/:id
router.delete('/:id', productController.delete);

//[GET] /product/search
router.get('/search', productController.search); // Route cho chức năng tìm kiếm

//[PATCH] /product/:id/restore
router.patch('/:id/restore', productController.restore);

//[DELETE] /product/:id/destroy
router.delete('/:id/destroy', productController.destroy);

//[GET] /product/slug
router.get('/:slug', productController.show);

module.exports = router;
