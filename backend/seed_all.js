const mongoose = require('mongoose');
const Category = require('./models/Categorymodel');
const Supplier = require('./models/Suppliermodel');
const Product = require('./models/Productmodel');
const Order = require('./models/Ordermodel');
const Sale = require('./models/Salesmodel');
const User = require('./models/Usermodel');
const ActivityLog = require('./models/ActivityLogmodel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for complete seeding...");

    // 1. Create/Find Admin User
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      const hashedpassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedpassword,
        role: 'admin'
      });
      console.log("Admin user created.");
    }

    // 2. Create Categories
    const categoriesData = [
      { name: "Grocery", description: "Food, beverages, and household staples" },
      { name: "Electronics", description: "Gadgets, smartphones, and accessories" },
      { name: "Fashion", description: "Clothing, footwear, and traditional wear" },
      { name: "Personal Care", description: "Skincare, hair care, and hygiene" }
    ];
    const categories = [];
    for (const cat of categoriesData) {
      let c = await Category.findOne({ name: cat.name });
      if (!c) c = await Category.create(cat);
      categories.push(c);
    }
    console.log(`${categories.length} Categories ready.`);

    // 3. Create Suppliers
    const suppliersData = [
      { name: "Bharat Wholesale", phone: "+91 1122334455", email: "info@bharatwholesale.in", address: "Okhla Industrial Area, Delhi" },
      { name: "Reliance Retail Supply", phone: "+91 2244556677", email: "support@reliancesupply.com", address: "Bandra Kurla Complex, Mumbai" },
      { name: "TechNova Distributions", phone: "+91 8011223344", email: "sales@technova.com", address: "Whitefield, Bangalore" },
      { name: "Surat Textile Hub", phone: "+91 2611223344", email: "orders@surattextile.in", address: "Ring Road, Surat" }
    ];
    const suppliers = [];
    for (const sup of suppliersData) {
      let s = await Supplier.findOne({ name: sup.name });
      if (!s) {
        s = await Supplier.create({
          name: sup.name,
          contactInfo: { phone: sup.phone, email: sup.email, address: sup.address }
        });
      }
      suppliers.push(s);
    }
    console.log(`${suppliers.length} Suppliers ready.`);

    // 4. Create Products
    const productsData = [
      { name: "Aashirvaad Atta", Desciption: "Whole wheat flour, 10kg pack.", catIdx: 0, price: 480, qty: 150, supIdx: 0 },
      { name: "Fortune Soyabean Oil", Desciption: "Refined Soyabean oil, 5L jar.", catIdx: 0, price: 720, qty: 80, supIdx: 1 },
      { name: "Maggi 2-Minute Noodles", Desciption: "Masala noodles, pack of 12.", catIdx: 0, price: 168, qty: 300, supIdx: 0 },
      { name: "OnePlus Nord CE 3", Desciption: "5G Smartphone, 8GB RAM, 128GB Storage.", catIdx: 1, price: 19999, qty: 25, supIdx: 2 },
      { name: "Noise ColorFit Pulse", Desciption: "Smartwatch with heart rate monitoring.", catIdx: 1, price: 2499, qty: 45, supIdx: 2 },
      { name: "Levis 511 Slim Jeans", Desciption: "Dark wash denim jeans for men.", catIdx: 2, price: 3499, qty: 40, supIdx: 3 },
      { name: "FabIndia Silk Kurta", Desciption: "Hand-woven silk kurta for festive wear.", catIdx: 2, price: 4200, qty: 15, supIdx: 3 },
      { name: "Mamaearth Onion Hair Oil", Desciption: "Natural oil for hair fall control, 250ml.", catIdx: 3, price: 599, qty: 100, supIdx: 1 },
      { name: "Himalaya Neem Face Wash", Desciption: "Purifying face wash for oily skin, 200ml.", catIdx: 3, price: 250, qty: 120, supIdx: 1 }
    ];
    const products = [];
    for (const prod of productsData) {
      let p = await Product.findOne({ name: prod.name });
      if (!p) {
        p = await Product.create({
          name: prod.name,
          Desciption: prod.Desciption,
          Category: categories[prod.catIdx]._id,
          Price: prod.price,
          quantity: prod.qty,
          supplier: suppliers[prod.supIdx]._id
        });
      }
      products.push(p);
    }
    console.log(`${products.length} Products ready.`);

    // 5. Create Orders (Procurement)
    const ordersData = [
      { prodIdx: 0, qty: 50, price: 450, status: 'delivered', desc: "Restocking Atta for festival season" },
      { prodIdx: 3, qty: 10, price: 19000, status: 'pending', desc: "Stocking up on newly launched OnePlus" },
      { prodIdx: 7, qty: 30, price: 550, status: 'shipped', desc: "Regular restock of Personal Care" }
    ];
    for (const ord of ordersData) {
      const product = products[ord.prodIdx];
      await Order.create({
        user: admin._id,
        Description: ord.desc,
        Product: {
          product: product._id,
          quantity: ord.qty,
          price: ord.price
        },
        totalAmount: ord.qty * ord.price,
        status: ord.status
      });
    }
    console.log("Procurement Orders created.");

    // 6. Create Sales
    const salesData = [
      { customer: "Rahul Sharma", prodIdx: 3, qty: 1, method: "creditcard", status: "completed" },
      { customer: "Anita Singh", prodIdx: 6, qty: 2, method: "banktransfer", status: "completed" },
      { customer: "Kirana Shop", prodIdx: 0, qty: 10, method: "cash", status: "pending" }
    ];
    for (const sale of salesData) {
      const product = products[sale.prodIdx];
      await Sale.create({
        customerName: sale.customer,
        products: {
          product: product._id,
          quantity: sale.qty,
          price: product.Price
        },
        totalAmount: sale.qty * product.Price,
        paymentStatus: sale.status === 'completed' ? 'paid' : 'pending',
        paymentMethod: sale.method,
        status: sale.status
      });
    }
    console.log("Sales records created.");

    // 7. Activity Logs
    await ActivityLog.create({
      action: "System Initialization",
      description: "Database seeded with complete initial dataset for India market.",
      entity: "system"
    });
    console.log("Activity Logs added.");

    console.log("Full seeding complete! You can now log in with admin@example.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error during full seeding:", error);
    process.exit(1);
  }
}

seedAll();
