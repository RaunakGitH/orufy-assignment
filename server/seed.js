const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'CakeZone Walnut Brownie',
    type: 'Grocery Products',
    stock: 120,
    mrp: 250,
    sellingPrice: 199,
    brandName: 'CakeZone',
    images: [],
    exchangeOrReturn: 'No exchange or return applicable',
    isPublished: true,
  },
  {
    name: 'CakeZone Choco Fudge Brownie',
    type: 'Grocery Products',
    stock: 80,
    mrp: 300,
    sellingPrice: 249,
    brandName: 'CakeZone',
    images: [],
    exchangeOrReturn: 'No exchange or return applicable',
    isPublished: true,
  },
  {
    name: 'Theobroma Christmas Cake',
    type: 'Grocery Products',
    stock: 50,
    mrp: 800,
    sellingPrice: 699,
    brandName: 'Theobroma',
    images: [],
    exchangeOrReturn: '7-day return policy',
    isPublished: false,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    console.log(' Cleared existing products');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(` Seeded ${inserted.length} products`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();