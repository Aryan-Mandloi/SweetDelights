const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            cakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
            quantity: { type: Number, required: true },
            subtotal: { type: Number, required: true },
            message: { type: String },
            weight: { type: String },
            selectedFlavor: { type: String }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
