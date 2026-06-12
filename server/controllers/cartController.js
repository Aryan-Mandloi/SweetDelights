const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.cakeId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { cakeId, quantity, subtotal, message, weight, selectedFlavor } = req.body;
        
        let cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(item => item.cakeId.toString() === cakeId && item.weight === weight && item.selectedFlavor === selectedFlavor);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].subtotal += subtotal;
        } else {
            cart.items.push({ cakeId, quantity, subtotal, message, weight, selectedFlavor });
        }

        cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update cart item
// @route   PUT /api/cart/update
// @access  Private
exports.updateCart = async (req, res) => {
    try {
        const { cakeId, quantity, selectedFlavor, weight } = req.body;
        
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.cakeId.toString() === cakeId && 
            item.selectedFlavor === selectedFlavor && 
            item.weight === weight
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        const Cake = require('../models/Cake');
        const cake = await Cake.findById(cakeId);
        if (!cake) {
            return res.status(404).json({ success: false, message: 'Cake not found' });
        }

        const unitPrice = cake.price;
        let multiplier = 1;
        if (weight) {
            const parsedWeight = parseFloat(weight);
            if (!isNaN(parsedWeight)) {
                multiplier = parsedWeight;
            }
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = quantity * unitPrice * multiplier;

        cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

        await cart.save();
        cart = await Cart.findOne({ userId: req.user._id }).populate('items.cakeId');
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/remove
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const cakeId = req.body.cakeId || req.query.cakeId;
        const selectedFlavor = req.body.selectedFlavor || req.query.selectedFlavor;
        const weight = req.body.weight || req.query.weight;

        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            !(item.cakeId.toString() === cakeId && 
              item.selectedFlavor === selectedFlavor && 
              item.weight === weight)
        );

        cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

        await cart.save();
        cart = await Cart.findOne({ userId: req.user._id }).populate('items.cakeId');
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
