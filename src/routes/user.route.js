const express = require('express');
const userController = require('../app/controllers/UserController');
const middlewareController = require('../middleware/middlewareController');
const router = express.Router();
const jwt = require('jsonwebtoken');


//[GET] /user/:id/edit
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

}, userController.edit);

//[POST] /user/handle-form-actions
router.post('/handle-form-actions', userController.handleFormActions);

//[PUT] /user/:id
router.put('/:id', userController.update);

//[DELETE] /user/:id
router.delete('/:id', userController.delete);

//[PATCH] /user/:id/restore
router.patch('/:id/restore', userController.restore);

//[PATCH] /user/
router.patch('/:id', userController.admin);

//[GET] /user
router.get('/', userController.listUsers);

module.exports = router;
