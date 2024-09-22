const user = require('../models/user.model');
const { mongooseToObject } = require('../../util/mongoose.js');
const { multipleMongooseToObject } = require('../../util/mongoose.js');
const jwt = require('jsonwebtoken');
const path = require('path');

class MeController{
    //[GET]/me
    async index(req, res, next){
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        await user.findById(result._id)
            .then(user => {
                res.render('me/show',{
                    user: mongooseToObject(user),
                })
            })
            .catch(err => {
                res.json({error: err.message})
            });
    }

    //[GET]/me/update
    async update(req, res, next){
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        await user.findById(result._id)
            .then(user => {
                res.render('me/update',{
                    user: mongooseToObject(user),
                })
            })
            .catch(err => {
                res.json({error: err.message})
            });
    }
    //[PUT]/me/:id
    async handleUpdate(req, res, next){
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        await user.updateOne({ _id: result._id }, req.body)
            .then(() =>res.redirect('/me'))
            .catch(err => {
                res.json({error: err.message});
            });
    }

    //[PATCH]/update-image
    async handleUpdateImage(req, res, next){
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        const imagePath = req.file.path;
        const imageName = path.basename(imagePath);

        await user.updateOne({ _id: result._id }, { image: imageName })
            .then(() => res.redirect('/me'))
            .catch(err => {
                res.json({error: err.message});
            });
    }
}
module.exports = new MeController();