const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery_db');
        console.log('MongoDB Connected for Updating Images');

        // Update Milk
        const milkRes = await Product.findOneAndUpdate(
            { name: { $regex: /milk/i } },
            { image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=60' },
            { new: true }
        );
        if (milkRes) console.log('Milk image updated');

        // Update Eggs
        const eggRes = await Product.findOneAndUpdate(
            { name: { $regex: /egg/i } },
            { image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=500&q=60' },
            { new: true }
        );
        if (eggRes) console.log('Eggs image updated');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

updateImages();
