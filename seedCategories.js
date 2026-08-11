const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery_db');
        console.log('MongoDB Connected for Seeding');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const categories = [
    { name: 'Fruits & Vegetables' },
    { name: 'Dairy & Bakery' },
    { name: 'Staples & Spices' },
    { name: 'Snacks & Beverages' },
    { name: 'Personal Care' },
    { name: 'Household Needs' },
    { name: 'Meat & Seafood' }
];

const seedData = async () => {
    await connectDB();
    try {
        // Optional: clear existing categories first to avoid duplicates
        // await Category.deleteMany(); 
        
        // Use insertMany or just check if exists
        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`Added Category: ${cat.name}`);
            } else {
                console.log(`Category already exists: ${cat.name}`);
            }
        }
        
        console.log('Categories seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error}`);
        process.exit(1);
    }
};

seedData();
