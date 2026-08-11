const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables (optional for local dev)
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Static frontend folder
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).send('Not found');
    }
});

// Seed Initial Admin User if needed (For demonstration purposes)
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@grocery.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({
                name: 'Admin User',
                email: 'admin@grocery.com',
                password: hashedPassword,
                phone: '1234567890',
                address: 'Admin HQ',
                role: 'admin'
            });
            console.log('Admin user seeded');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};
seedAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
