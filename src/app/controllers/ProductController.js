const product = require('../models/product.model');
const user = require('../models/user.model.js');
const comment = require('../models/comment.model.js');
const { mongooseToObject } = require('../../util/mongoose.js');
const { multipleMongooseToObject } = require('../../util/mongoose.js');
const { response } = require('express');

class ProductController {
    //[GET] /product/:slug
    async show(req, res, next) {
        try {
            const productData = await product.findOne({ slug: req.params.slug });
            if (!productData) {
                return res.status(404).json({ error: "Product not found" });
            }
    
            // Bây giờ productData không rỗng, bạn có thể thực hiện các truy vấn tiếp theo.
            const [users, comments] = await Promise.all([
                user.find({}),
                comment.find({ productId: productData._id })
            ]);
            // Chỉ cần một lệnh gọi res.render cho mỗi yêu cầu.
            res.render('products/show', {
                product: mongooseToObject(productData),
                users: multipleMongooseToObject(users),
                comments: multipleMongooseToObject(comments)
            });
        } catch (err) {
            // Nếu có bất kỳ lỗi nào xảy ra trong quá trình xử lý, gửi phản hồi lỗi.
            res.status(500).json({ error: err.message });
        }

        // Promise.all([product.findOne({ slug: req.params.slug }), user.find({}), comment.find({})])
        //     .then(([product, users, comments])=>{
        //         res.render('products/show', {
        //             product: mongooseToObject(product),
        //             users: multipleMongooseToObject(users),
        //             comments: multipleMongooseToObject(comments)
        //         });
        //     })
        //     .catch(next);


        // // res.send('Product: '+ req.params.slug)
        // await product
        //     .findOne({ slug: req.params.slug })
        //     .then((product) => {
        //         res.render('products/show', {
        //             product: mongooseToObject(product),
        //         });
        //     })
        //     .catch(next);
    }
    //[GET] /product/create
    create(req, res, next) {
        res.render('products/create');
    }

    //[POST] /product/store
    store(req, res, next) {
        // res.json(req.body);
        const products = new product(req.body);
        products
            .save()
            .then(() => res.redirect('/stored/product'))
            .catch((err) => {});
    }

    //[GET] /product/:id/edit
    async edit(req, res, next) {
        await product
            .findById(req.params.id)
            .then((product) =>
                res.render('products/edit', {
                    product: mongooseToObject(product),
                }),
            )
            .catch((next) =>
                res.json({
                    err: 'Error updating product',
                }),
            );
    }
    //[PUT] /product/:id
    async update(req, res, next) {
        await product.updateOne({ _id: req.params.id }, req.body);
        try {
            res.redirect('/stored/product');
        } catch (err) {
            res.json({ err: err.message });
        }
    }
    //[DELETE] /product/:id
    async delete(req, res, next) {
        await product.delete({ _id: req.params.id });
        try {
            res.redirect('back');
        } catch (err) {
            res.json({ err: err.message });
        }
    }
    //[PATCH] /product/:id/restore
    async restore(req, res, next) {
        await product.restore({ _id: req.params.id });
        try {
            res.redirect('back');
        } catch (err) {
            res.json({ err: err.message });
        }
    }
    //[DELETE] /product/:id
    async destroy(req, res, next) {
        await product.deleteOne({ _id: req.params.id });
        try {
            res.redirect('back');
        } catch (err) {
            res.json({ err: err.message });
        }
    }


    //[GET] /product/search
    search(req, res, next) {
        const kq = req.query.q; 
        product.find({
            name: { $regex: new RegExp(kq, 'i') } // Tìm kiếm không phân biệt hoa thường
        })
        .then(products =>
                //res.json(products)
                res.render('home', { products: multipleMongooseToObject(products) })
             )
        .catch(next);
    }

    //[POST] /product//handle-form-actions
    async handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                await product.delete({ _id: { $in: req.body.productIds } });
                try {
                    res.redirect('back');
                } catch (err) {
                    res.json({ err: err.message });
                }
                break;

            case 'restore':
                await product.restore({ _id: { $in: req.body.productIds } });
                try {
                    res.redirect('back');
                } catch (err) {
                    res.json({ err: err.message });
                }
                break;
                
            case 'destroy':
                await product.deleteMany({ _id: { $in: req.body.productIds } });
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
}

module.exports = new ProductController();
