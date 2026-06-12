const express = require('express');
const { getCakes, getCake, createCake, updateCake, deleteCake } = require('../controllers/cakeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getCakes)
    .post(protect, authorize('admin'), createCake);

router.route('/:id')
    .get(getCake)
    .put(protect, authorize('admin'), updateCake)
    .delete(protect, authorize('admin'), deleteCake);

module.exports = router;
