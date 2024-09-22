const product = require('../models/product.model');
const jwt = require('jsonwebtoken');
const { multipleMongooseToObject } = require('../../util/mongoose.js');
const Order = require('../models/order.model');
class CartController {
    //[GET] /cart
    async show(req, res, next) {
        try {
            let cart = req.session.cart || {};
            let displayCart = { items: [], total: 0 };
            let total = 0;
            // Lấy danh sách ID sản phẩm từ giỏ hàng
            const productIds = Object.keys(cart);

            const products = await product.find({ _id: { $in: productIds } }).lean();
            // Duyệt qua từng sản phẩm và thêm vào displayCart
            products.forEach((prod) => {
                const quantity = cart[prod._id]; // Lấy số lượng sản phẩm từ giỏ hàng
                displayCart.items.push({
                    product: prod, // Thêm thông tin sản phẩm vào displayCart
                    quantity: quantity,
                });
                total += quantity; 
            });

            displayCart.total = total;
            //res.json(displayCart.items[0].product);
            res.render('cart/show', { cart: displayCart });
        } catch (error) {
            next(error);
        }
    }

    //[POST] cart/add-to-cart
    addToCart(req, res, next){
        var { productId, quantity } = req.body;
        var quantity = Number(quantity);
        const cart = req.session.cart || {};
        if (cart[productId]) {
            cart[productId] += quantity;
        } else {
            cart[productId] = quantity;
        }
        req.session.cart = cart;    
        res.redirect('back');
    }

    //[DELETE] cart/:id
    removeFromCart(req, res, next) {
        const productId = req.params.id;
        let cart = req.session.cart;
        if (cart && cart[productId]) {
          delete cart[productId];
          req.session.cart = cart;
        }
        res.redirect('back');
    }

    //[POST] cart//export-invoice
    exportInvoice(req, res, next) {
        const { checkedProductIds, totalAmounts } = req.body;
        // Thực hiện logic để xuất hóa đơn tại đây
        // Ví dụ:
        const invoice = {
            products: checkedProductIds,
            totalAmount: totalAmounts.reduce((acc, curr) => acc + curr, 0)
        };
        res.json(invoice);
    }

    //[GET]/cart/bill
    async bill(req, res, next) {
        try {
            var data = req.cookies.cartData;
            var cartData = JSON.parse(data)||{};
            var productIds = [];
            var sum = 0;
            let displayCart = { items: [], total: 0 };
            let total = 0;
            cartData.forEach(function (a){
                productIds.push(a.productId);
                sum += a.totalAmount;   
            });
    
            const products = await product.find({ _id: { $in: productIds } }).lean();
            products.forEach((prod) => {
                const quantity = cartData.find(item => String(item.productId) === String(prod._id)).quantity;
                displayCart.items.push({
                    product: prod, // Thêm thông tin sản phẩm vào displayCart
                    quantity: quantity,
                });
                total += quantity; 
            });
            displayCart.total = total;
            //res.json(displayCart.items[0].product);
            res.render('cart/bill', {
                cart: displayCart,
                sumCost: sum,
            });
        } catch (error) {
            next(error);
        }
    }
    
    //[GET]/cart/order-confirm 
    getOrderConfirm(req, res) {
        res.render('cart/orderConfirm');
    }

    async handleConfirmOrder(req, res, next) {
        try {
            const orderId = req.params.orderId;
            // Cập nhật trạng thái của đơn hàng thành "Đã xác nhận"
            await Order.findByIdAndUpdate(orderId, { status: 'Đã xác nhận' });
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    createOrder(req, res) {
        const { shippingAddress, sumCost } = req.body;
        const newOrder = new Order({
            shippingAddress: shippingAddress,
            sumCost: sumCost ,
        });

        newOrder.save()
            .then(next)
            
    }

    updateOrderStatus (req, res){
        const { orderId, status } = req.body;
        // Logic to update order status in the database
        Order.findByIdAndUpdate(orderId, { status: status }, { new: true })
            .then((updatedOrder) => {
                res.json(updatedOrder);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Internal Server Error');
            });
    }
}
module.exports = new CartController();