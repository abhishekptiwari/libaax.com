const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/order', orderController.getOrders);
router.post('/api/payment/verify', orderController.capturePayment);
// router.get('/all_payments', orderController.allPayments);

module.exports = router;
