const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cakes', require('./routes/cakeRoutes'));
// app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/payment', require('./routes/paymentRoutes'));

app.get('/api/seed', async (req, res) => {
    const seedDB = require('./seedEndpoint');
    const success = await seedDB();
    if (success) {
        res.send('Database seeded successfully! You can now log in with admin@sweetdelights.com / adminpassword123');
    } else {
        res.status(500).send('Error seeding database.');
    }
});
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
