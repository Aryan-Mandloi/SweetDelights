const express = require('express');
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getCart);
router.route('/add').post(protect, addToCart);
router.route('/update').put(protect, updateCart);
router.route('/remove').delete(protect, removeFromCart);

module.exports = router;
