const product = require('../models/product.model.js');
const user = require('../models/user.model.js');
const { multipleMongooseToObject } = require('../../util/mongoose.js');

class TrashController {
    //[GET] /trash/product
    async showProductTrashed(req, res) {
        // const products = await product.findWithDeleted({ deleted: true});
        // res.json(multipleMongooseToObject(products))
        try {
            const products = await product.findWithDeleted({ deleted: true});
            res.render('trash/trashProduct', {
                products: multipleMongooseToObject(products),
            });
        } catch (err) {
            res.json({ err: err.message });
        }
    }

    //[GET] /trash/user
    async showUserTrashed(req, res) {
        try {
            const users = await user.findWithDeleted({ deleted: true});
            res.render('trash/trashUser', {
                users: multipleMongooseToObject(users),
            });
        } catch (err) {
            res.json({ err: err.message });
        }
    }
}

module.exports = new TrashController();
