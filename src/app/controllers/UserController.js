const user = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { mongooseToObject } = require('../../util/mongoose.js');



class UserController {

    // [GET] /user
    async listUsers(req, res, next) {
        await user.find()
            .then((user) => res.json({ user }))
            .catch((next))
    }
    
    //[GET] /user/:id/edit
    async edit(req, res, next) {
        await user
            .findById(req.params.id)
            .then((user) =>
                res.render('user/edit', {
                    user: mongooseToObject(user),
                }),
            )
            .catch((next) =>
                res.json({
                    err: 'Error updating user',
                }),
            );
    }
    //[PUT] /user/:id
    async update(req, res, next) {
        await user.updateOne({ _id: req.params.id }, req.body);
        try {
            res.redirect('/stored/user');
        } catch (err) {
            res.json({ err: err.message });
        }
    }
    //[DELETE] /user/:id
    async delete(req, res, next) {
        await user.delete({ _id: req.params.id });
        try {
            res.redirect('back');
        } catch (err) {
            res.json({ err: err.message });
        }
    }
    //[PATCH] /user/:id/restore
    async restore(req, res, next) {
        await user.restore({ _id: req.params.id });
        try {
            res.redirect('back');
        } catch (err) {
            res.json({ err: err.message });
        }
    }
    //[DELETE] /user/:id
    async destroy(req, res, next) {
        await user.deleteOne({ _id: req.params.id });
        try {
            res.redirect('back');
        } catch (err) {
            res.json({ err: err.message });
        }
    }

    //[POST] /user//handle-form-actions
    async handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                await user.delete({ _id: { $in: req.body.userIds } });
                try {
                    res.redirect('back');
                } catch (err) {
                    res.json({ err: err.message });
                }
                break;

            case 'restore':
                await user.restore({ _id: { $in: req.body.userIds } });
                try {
                    res.redirect('back');
                } catch (err) {
                    res.json({ err: err.message });
                }
                break;
                
            case 'destroy':
                await user.deleteMany({ _id: { $in: req.body.userIds } });
                try {
                    res.redirect('back');
                } catch (err) {
                    res.json({ err: err.message });
                }
                break;
        
            default:
                res.json({ err: 'Invalid action'})
        }
    }


    //[GET] /user
    getCreateUser(req, res, next) {
        res.render('user/create');
    }

    //[PATCH] /user/
    async admin(req, res, next){
        await user.findOneAndUpdate({ _id: req.params.id }, { $set: { admin: true } })
            try{
                res.redirect('back');
            }catch (err) {
                res.json({ err: err.message });
            }
    }
    
}
module.exports = new UserController();