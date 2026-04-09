const mongoose = require('mongoose');
const Category = require('./models/Categorymodel');
const Supplier = require('./models/Suppliermodel');
const Product = require('./models/Productmodel');
require('dotenv').config();

const products = [
  {
    name: "Daawat Basmati Rice",
    Desciption: "Premium long grain Basmati rice, aged for perfection. 5kg pack.",
    CategoryName: "Grocery",
    Price: 750,
    quantity: 100
  },
  {
    name: "Tata Tea Gold",
    Desciption: "Rich and aromatic loose leaf tea, 1kg pack.",
    CategoryName: "Grocery",
    Price: 450,
    quantity: 200
  },
  {
    name: "MDH Garam Masala",
    Desciption: "Authentic spice blend for Indian curries, 500g.",
    CategoryName: "Grocery",
    Price: 220,
    quantity: 150
  },
  {
    name: "BoAt Rockerz 450",
    Desciption: "On-ear wireless headphones with long battery life.",
    CategoryName: "Electronics",
    Price: 1499,
    quantity: 50
  },
  {
    name: "Samsung Galaxy M34",
    Desciption: "5G Smartphone with 6000mAh battery and Super AMOLED display.",
    CategoryName: "Electronics",
    Price: 16999,
    quantity: 30
  },
  {
    name: "Cotton Anarkali Kurti",
    Desciption: "Elegant hand-block printed cotton Kurti for women.",
    CategoryName: "Fashion",
    Price: 1200,
    quantity: 60
  },
  {
    name: "Silk Zari Saree",
    Desciption: "Beautiful Banarasi Silk saree with gold zari work.",
    CategoryName: "Fashion",
    Price: 5500,
    quantity: 20
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");

    // Create a default supplier if none exists
    let supplier = await Supplier.findOne({ name: "Bharat Distributors" });
    if (!supplier) {
      supplier = await Supplier.create({
        name: "Bharat Distributors",
        contactPerson: "Rajesh Kumar",
        email: "rajesh@bharatdist.com",
        phone: "+91 9876543210",
        address: "Chandni Chowk, Delhi, India"
      });
      console.log("Sample supplier created.");
    }

    for (const item of products) {
      // Find or create category
      let category = await Category.findOne({ name: item.CategoryName });
      if (!category) {
        category = await Category.create({
          name: item.CategoryName,
          description: `Items related to ${item.CategoryName}`
        });
        console.log(`Category ${item.CategoryName} created.`);
      }

      // Find or create product
      const productExist = await Product.findOne({ name: item.name });
      if (!productExist) {
        await Product.create({
          name: item.name,
          Desciption: item.Desciption,
          Category: category._id,
          Price: item.Price,
          quantity: item.quantity,
          supplier: supplier._id
        });
        console.log(`Product ${item.name} added.`);
      } else {
        console.log(`Product ${item.name} already exists, skipping.`);
      }
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
