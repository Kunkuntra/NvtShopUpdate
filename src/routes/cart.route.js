const cartController = require("../app/controllers/CartController");
const router = require("express").Router();

router.post("/add-to-cart", cartController.addToCart);

router.delete('/:id', cartController.removeFromCart);

router.get('/bill', cartController.bill);

router.post('/update-order-status', cartController.updateOrderStatus);

router.get('/order-confirm', (req, res) => {
    res.render('cart/orderConfirm');
});

router.post('/create-order',cartController.createOrder);

router.post('/confirm-order/:orderId', cartController.handleConfirmOrder);

router.post("/export-invoice", cartController.exportInvoice);

router.get("/", cartController.show);

module.exports = router;