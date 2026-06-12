const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
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
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
