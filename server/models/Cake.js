const mongoose = require('mongoose');

const CakeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flavor: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, default: 10 },
    rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cake', CakeSchema);
