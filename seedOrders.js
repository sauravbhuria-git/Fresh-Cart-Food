const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
const Payment = require('./models/Payment');

dotenv.config();

const seedOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery_db');
        
        // Find a customer user
        const customer = await User.findOne({ role: 'customer' });
        if (!customer) {
            console.log('No customer found to associate orders with.');
            process.exit(1);
        }

        // Find some products
        const products = await Product.find().limit(3);
        if (products.length === 0) {
            console.log('No products found.');
            process.exit(1);
        }

        const fakeOrders = [
            {
                user: customer._id,
                orderItems: [
                    { product: products[0]._id, quantity: 2, unitPrice: products[0].price }
                ],
                deliveryAddress: '123 Fake Street, City',
                paymentMethod: 'Online',
                totalAmount: products[0].price * 2,
                status: 'Delivered'
            },
            {
                user: customer._id,
                orderItems: [
                    { product: products[1]._id, quantity: 1, unitPrice: products[1].price },
                    { product: products[2]._id, quantity: 3, unitPrice: products[2].price }
                ],
                deliveryAddress: '456 Test Avenue, Town',
                paymentMethod: 'COD',
                totalAmount: (products[1].price * 1) + (products[2].price * 3),
                status: 'Shipped'
            },
            {
                user: customer._id,
                orderItems: [
                    { product: products[0]._id, quantity: 5, unitPrice: products[0].price }
                ],
                deliveryAddress: '789 Demo Lane, Village',
                paymentMethod: 'Online',
                totalAmount: products[0].price * 5,
                status: 'Placed'
            }
        ];

        let totalRevenue = 0;
        for (const orderData of fakeOrders) {
            const newOrder = await Order.create(orderData);
            
            // If online, create fake payment
            if (orderData.paymentMethod === 'Online') {
                await Payment.create({
                    user: customer._id,
                    order: newOrder._id,
                    transactionId: 'TXN' + Math.floor(Math.random() * 1000000000),
                    amount: orderData.totalAmount,
                    paymentMethod: 'UPI',
                    paymentStatus: 'Completed'
                });
            }

            totalRevenue += orderData.totalAmount;
        }

        console.log(`Successfully seeded ${fakeOrders.length} fake orders. Added ₹${totalRevenue} to revenue.`);
        process.exit();
    } catch (error) {
        console.error('Error seeding orders:', error);
        process.exit(1);
    }
};

seedOrders();
