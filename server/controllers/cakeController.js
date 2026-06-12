const Cake = require('../models/Cake');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Helper to find or create category by name or ID
const resolveCategory = async (categoryInput) => {
    if (!categoryInput) return null;
    
    // Check if it's already a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(categoryInput)) {
        return categoryInput;
    }
    
    // Otherwise treat as category name (case-insensitive)
    let category = await Category.findOne({
        categoryName: { $regex: new RegExp(`^${categoryInput.trim()}$`, 'i') }
    });
    
    if (!category) {
        category = await Category.create({ categoryName: categoryInput.trim() });
    }
    
    return category._id;
};

// @desc    Get all cakes
// @route   GET /api/cakes
// @access  Public
exports.getCakes = async (req, res) => {
    try {
        const cakes = await Cake.find().populate('category', 'categoryName');
        res.status(200).json({ success: true, count: cakes.length, data: cakes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single cake
// @route   GET /api/cakes/:id
// @access  Public
exports.getCake = async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id).populate('category', 'categoryName');
        if (!cake) {
            return res.status(404).json({ success: false, message: 'Cake not found' });
        }
        res.status(200).json({ success: true, data: cake });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new cake
// @route   POST /api/cakes
// @access  Private/Admin
exports.createCake = async (req, res) => {
    try {
        if (req.body.category) {
            req.body.category = await resolveCategory(req.body.category);
        }
        const cake = await Cake.create(req.body);
        const populatedCake = await Cake.findById(cake._id).populate('category', 'categoryName');
        res.status(201).json({ success: true, data: populatedCake });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update cake
// @route   PUT /api/cakes/:id
// @access  Private/Admin
exports.updateCake = async (req, res) => {
    try {
        if (req.body.category) {
            req.body.category = await resolveCategory(req.body.category);
        }
        const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('category', 'categoryName');
        
        if (!cake) {
            return res.status(404).json({ success: false, message: 'Cake not found' });
        }
        res.status(200).json({ success: true, data: cake });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete cake
// @route   DELETE /api/cakes/:id
// @access  Private/Admin
exports.deleteCake = async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (!cake) {
            return res.status(404).json({ success: false, message: 'Cake not found' });
        }
        await cake.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
