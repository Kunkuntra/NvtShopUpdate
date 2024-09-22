const express = require('express');
const router = express.Router();
const Order = require('../app/models/order.model');
const User = require('../app/models/user.model');
const Product = require('../app/models/product.model');
const { mongooseToObject } = require('../util/mongoose.js');
const { multipleMongooseToObject } = require('../util/mongoose.js');
const jwt = require('jsonwebtoken');

router.post('/create-order', async (req, res) => {
    try {
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        const userId = result._id;

        const data = req.body.data;
        const sumCost = req.body.sumCost;
        const shippingAddress = req.body.shippingAddress;
        const newOrder = new Order({ 
            userId: userId,
            data: data,
            totalCost: sumCost,
            shippingAddress: shippingAddress,
        });
        await newOrder.save();
        res.render('Notify/orderWait');
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi tạo đơn hàng.' });
    }
});

router.get('/admin/order', (req, res, next)=>{
    var token = req.cookies.token;
    var result = jwt.verify(token, 'mk');
    if (!result.admin){
        res.json('Bạn không đủ quyền' )
    }
    next();

}, async (req, res, next) =>{
    try {
        const orders = await Order.find().lean();
        const data = [];
        for (const order of orders) {
            const user = await User.findOne({_id: order.userId}).lean();
            data.push({
                order: order,
                user: user,
            });
        }
        // res.json(data);
        res.render('cart/orderConfirm', { data: data });
    } catch (error) {
        next(error);
    }
});

router.put('/confirm-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'Confirmed' }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        }
        const order = await Order.findOne({_id: orderId}).lean();
        const items = JSON.parse(order.data).items; 
        // Giảm số lượng từ trường remaining trong cơ sở dữ liệu
        for (const item of items) {
            const productId = item.product._id;
            const quantity = item.quantity;

            await Product.findByIdAndUpdate(productId, { $inc: { remaining: -quantity } });
        }
        // res.json(order);
        res.redirect('back');
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi xác nhận đơn hàng.' });
    }
});

router.put('/delivered-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'Delivered' }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        }
        res.redirect('back');
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi hoàn thành đơn hàng.' });
    }
});

router.put('/cancel-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'Cancel' }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        }
        res.redirect('back');
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi hoàn thành đơn hàng.' });
    }
});

router.get('/info-order/:id',async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        }
        const user = await User.findById(order.userId);
        const data = JSON.parse(order.data);
        res.render('cart/orderShow',{
            cart: data,
            user: mongooseToObject(user)
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/me', async (req, res)=>{
    try{
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        const userId = result._id;
        const orders = await Order.find({userId: userId}).lean();
        const data = [];
            for (const order of orders) {
                const user = await User.findOne({_id: order.userId}).lean();
                data.push({
                    order: order,
                    user: user,
                });
            }
        res.render('cart/meOrder', { data: data });
        
    }
    catch{

    }
});

router.put('/handle-order', async (req, res)=>{
    // res.json(req.body);
    switch(req.body.action){
        case 'confirm':
            try {
                const orderId = req.body.productIds;
                const updatedOrder = await Order.findByIdAndUpdate({$in: orderId}, { status: 'Confirmed' }, { new: true });
                if (!updatedOrder) {
                    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
                }
                res.redirect('back');
            } catch (error) {
                res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi xác nhận đơn hàng.' });
            }
            break;
        
        case 'deliver':
            try {
                const orderId = req.body.productIds;
                const updatedOrder = await Order.findByIdAndUpdate({$in: orderId}, { status: 'Delivered' }, { new: true });
                if (!updatedOrder) {
                    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
                }
                res.redirect('back');
            } catch (error) {
                res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi hoàn thành đơn hàng.' });
            }
            break;
        
        case 'cancel':
            try {
                const orderId = req.body.productIds;
                const updatedOrder = await Order.findByIdAndUpdate({$in: orderId}, { status: 'Cancel' }, { new: true });
                if (!updatedOrder) {
                    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
                }
                res.redirect('back');
            } catch (error) {
                res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi hủy đơn hàng.' });
            }
            break;
        
        
    }
});

router.get('/payment-info',async (req, res) => {
    try {
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        const userId = result._id;

        const data = req.body.data;
        const sumCost = req.body.sumCost;
        const shippingAddress = req.body.shippingAddress;
        const newOrder = new Order({ 
            userId: userId,
            data: data,
            totalCost: sumCost,
            shippingAddress: shippingAddress,
        });
        await newOrder.save();
        res.render('cart/pay');
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi tạo đơn hàng.' });
    }
    
});

router.get('/success-pay', (req, res) =>{
    res.render('Notify/ByOrder.hbs');
});

module.exports = router;