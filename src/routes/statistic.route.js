const express = require('express');
const router = express.Router();
const Order = require('../app/models/order.model');
const { startOfDay: startDay, endOfDay: endDay, format } = require('date-fns');

const calculateDailyRevenue = async (date) => {
    try {
        const startOfDay = startDay(date); 
        const endOfDay = endDay(date); 

        // Truy vấn để lấy các đơn hàng trong ngày được chỉ định
        const orders = await Order.find({
            updatedAt: { $gte: startOfDay, $lte: endOfDay },
            status: "Delivered" // Chỉ xem xét các đơn hàng đã hoàn thành
        });

        if (!orders || orders.length === 0 || !Array.isArray(orders)) {
            return {
                date: format(date, 'yyyy-MM-dd'), // Định dạng ngày
                totalRevenue: 0, // Không có doanh thu
                totalOrders: 0, // Không có đơn hàng
                orderDetails: [] // Không có chi tiết đơn hàng
            };
        }
        
        // Tính tổng doanh thu của các đơn hàng trong ngày
        let totalRevenue = 0;
        let totalOrders = orders.length; // Đếm số đơn hàng
        let orderDetails = []; // Danh sách chi tiết đơn hàng
        
        orders.forEach(order => {
            totalRevenue += order.totalCost;
            if (order.data) {
                try {
                    const items = JSON.parse(order.data).items;
                    if (Array.isArray(items)) {
                        items.forEach(item => {
                            orderDetails.push({
                                product: item.product,
                                quantity: item.quantity,
                                subtotal: item.product.currentPrice * item.quantity // Tính thành tiền cho từng sản phẩm
                            });
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi phân tích cú pháp JSON từ trường "data" của đơn hàng:', error);
                }
            }
        });
        

        return {
            date: format(date, 'yyyy-MM-dd'), // Định dạng ngày
            totalRevenue: totalRevenue, // Tổng doanh thu trong ngày
            totalOrders: totalOrders, // Tổng số đơn hàng trong ngày
            orderDetails: orderDetails // Chi tiết các đơn hàng
        };
    } catch (error) {
        console.error("Lỗi khi tính toán doanh thu hàng ngày:", error);
        throw error; // Ném lỗi để bắt ở nơi gọi
    }
};

const calculateDailyGroupRevenue = async (startDate, endDate) =>{
    try {
        const startOfDay = new Date(startDate); 
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1); // Thêm một ngày để bao gồm cả ngày kết thúc
        
        // Truy vấn để lấy các đơn hàng trong khoảng thời gian đã chỉ định
        const orders = await Order.find({
            updatedAt: { $gte: startOfDay, $lt: endOfDay }, // Sử dụng $lt thay vì $lte để không bao gồm ngày kết thúc
            status: "Delivered" // Chỉ xem xét các đơn hàng đã hoàn thành
        });

        if (!orders || orders.length === 0 || !Array.isArray(orders)) {
            return {
                dateStart: startOfDay.toISOString(), // Sử dụng toISOString() để chuyển đổi ngày thành chuỗi ngày tháng ISO
                dateEnd: endOfDay.toISOString(),
                totalRevenue: 0, 
                totalOrders: 0, 
                orderDetails: [] 
            };
        }
        
        // Tính tổng doanh thu của các đơn hàng trong khoảng thời gian đã chỉ định
        let totalRevenue = 0;
        let totalOrders = orders.length; // Đếm số đơn hàng
        let orderDetails = []; // Danh sách chi tiết đơn hàng
        
        orders.forEach(order => {
            totalRevenue += order.totalCost;
            if (order.data) {
                try {
                    const items = JSON.parse(order.data).items;
                    if (Array.isArray(items)) {
                        items.forEach(item => {
                            orderDetails.push({
                                product: item.product,
                                quantity: item.quantity,
                                subtotal: item.product.currentPrice * item.quantity // Tính thành tiền cho từng sản phẩm
                            });
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi phân tích cú pháp JSON từ trường "data" của đơn hàng:', error);
                }
            }
        });

        return {
            dateStart: startOfDay.toISOString(),
            dateEnd: endOfDay.toISOString(),
            totalRevenue: totalRevenue, 
            totalOrders: totalOrders, 
            orderDetails: orderDetails 
        };
    } catch (error) {
        console.error("Lỗi khi tính toán doanh thu hàng ngày:", error);
        throw error; // Ném lỗi để bắt ở nơi gọi
    }
}


router.get('/daily-revenue', async (req, res) => {
    try {
        // Lấy ngày hiện tại hoặc ngày được chỉ định từ query string
        const currentDate = req.query.date ? new Date(req.query.date) : new Date();

        // Tính toán doanh thu hàng ngày
        const dailyRevenue = await calculateDailyRevenue(currentDate);
        // res.json(dailyRevenue);
        res.render('statistic/revenue', { dailyRevenue: dailyRevenue }); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi lấy thông tin doanh thu hàng ngày. ',error: error.message});
    }
});

router.get('/group-revenue', async (req, res) => {
    res.render('statistic/groupRevenue')
});

router.post('/group-revenue', async (req, res) => {
    try {
        const { startDate, endDate } = req.body; // Lấy dữ liệu ngày bắt đầu và ngày kết thúc từ req.body

        // Tính toán doanh thu hàng ngày
        const dailyRevenue = await calculateDailyGroupRevenue(startDate, endDate); // Truyền cả startDate và endDate vào hàm calculateDailyGroupRevenue
        res.render('statistic/groupRevenue', { dailyRevenue: dailyRevenue }); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi lấy thông tin doanh thu. ',error: error.message});
    }
});


module.exports = router;
