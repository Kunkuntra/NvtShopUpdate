const product = require('../models/product.model');
const comment = require('../models/comment.model');
const { multipleMongooseToObject } = require('../../util/mongoose.js');
const jwt = require('jsonwebtoken');

class SiteController {
    //[GET] /
    async index(req, res, next) {
        const PAGE_SIZE = 6;  // Số lượng sản phẩm trên mỗi trang
        try {
            const productType = req.query.type || 'all';  // Lấy loại sản phẩm từ query, mặc định là 'all'
            let filter = {};  // Khởi tạo filter rỗng

            // Nếu có productType khác 'all', thêm vào filter
            if (productType !== 'all') {
                filter.productType = productType;
            }

            // Lấy số trang từ query
            let page = req.query.page ? parseInt(req.query.page) : 1;  // Mặc định là trang 1
            let skip = (page - 1) * PAGE_SIZE;  // Tính toán số sản phẩm cần bỏ qua

            // Lấy các sản phẩm dựa trên filter, phân trang với skip và limit
            const products = await product.find(filter).skip(skip).limit(PAGE_SIZE);

            // Đếm tổng số sản phẩm để tính toán tổng số trang
            const totalProducts = await product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

            // Render giao diện với sản phẩm, thông tin phân trang và loại sản phẩm đang active
            res.render('home', {
                products: multipleMongooseToObject(products),
                activeType: productType,  // Loại sản phẩm đang active
                currentPage: page,  // Trang hiện tại
                totalPages: totalPages  // Tổng số trang
            });

        } catch (err) {
            next(err);
        }
    }

    //[GET] /Search
    search(req, res) {
        res.render('Search');
    }

    // [GET] /comment
    async comment(req, res, next) {
        await comment.find()
            .then((comments) => res.json({ comments }))
            .catch(next)
    }

    //[POST] /comment
    addComment(req, res, next) {
        const content = req.body.comment;
        const productId = req.body.productId;
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        const userId = result._id;

        const newComment = new comment({
            content: content,
            userId: userId,
            productId: productId 
        });

        newComment.save()
        .then(() => res.redirect('back'))
        .catch((err) => {});
    }

}

module.exports = new SiteController();
