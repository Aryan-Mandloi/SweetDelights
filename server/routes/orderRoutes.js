const express = require('express');
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
