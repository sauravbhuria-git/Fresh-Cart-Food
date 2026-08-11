const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery_db');
        console.log('MongoDB Connected for Seeding Products');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const productsData = [
    {
        categoryName: 'Fruits & Vegetables',
        items: [
            { name: 'Fresh Red Apples (1kg)', price: 150, stock: 50, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&w=500&q=60' },
            { name: 'Organic Bananas (1 Dozen)', price: 60, stock: 100, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60' },
            { name: 'Fresh Broccoli', price: 80, stock: 30, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=60' }
        ]
    },
    {
        categoryName: 'Dairy & Bakery',
        items: [
            { name: 'Whole Milk (1L)', price: 65, stock: 40, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=60' },
            { name: 'Whole Wheat Bread', price: 45, stock: 25, image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=500&q=60' },
            { name: 'Farm Fresh Eggs (6 pcs)', price: 50, stock: 60, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=60' }
        ]
    },
    {
        categoryName: 'Staples & Spices',
        items: [
            { name: 'Basmati Rice (5kg)', price: 450, stock: 15, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=60' },
            { name: 'Turmeric Powder (250g)', price: 75, stock: 40, image: 'https://images.unsplash.com/photo-1615486171438-db407335606d?auto=format&fit=crop&w=500&q=60' }
        ]
    },
    {
        categoryName: 'Snacks & Beverages',
        items: [
            { name: 'Potato Chips - Salted', price: 20, stock: 100, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=60' },
            { name: 'Orange Juice (1L)', price: 110, stock: 35, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' }
        ]
    },
    {
        categoryName: 'Personal Care',
        items: [
            { name: 'Moisturizing Soap (Pack of 3)', price: 120, stock: 50, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=500&q=60' },
            { name: 'Anti-Dandruff Shampoo', price: 250, stock: 30, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=60' }
        ]
    },
    {
        categoryName: 'Household Needs',
        items: [
            { name: 'Liquid Laundry Detergent (1L)', price: 180, stock: 20, image: 'https://images.unsplash.com/photo-1584813470613-568bfd7fb4a7?auto=format&fit=crop&w=500&q=60' },
            { name: 'Dishwashing Liquid', price: 90, stock: 40, image: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfa5cd?auto=format&fit=crop&w=500&q=60' }
        ]
    },
    {
        categoryName: 'Meat & Seafood',
        items: [
            { name: 'Fresh Chicken Breast (500g)', price: 220, stock: 15, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60' },
            { name: 'Salmon Fillet (250g)', price: 450, stock: 10, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=60' }
        ]
    }
];

const seedProducts = async () => {
    await connectDB();
    try {
        await Product.deleteMany(); // Clear existing products
        
        for (const catData of productsData) {
            const category = await Category.findOne({ name: catData.categoryName });
            if (category) {
                for (const item of catData.items) {
                    await Product.create({
                        name: item.name,
                        category: category._id,
                        price: item.price,
                        stock: item.stock,
                        image: item.image
                    });
                    console.log(`Added Product: ${item.name}`);
                }
            } else {
                console.log(`Category not found: ${catData.categoryName}`);
            }
        }
        
        console.log('Products seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding products: ${error}`);
        process.exit(1);
    }
};

seedProducts();
