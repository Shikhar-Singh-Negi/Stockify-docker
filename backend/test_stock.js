const fs = require('fs');
const mongoose = require('mongoose');
require('./models/Suppliermodel');
require('./models/Productmodel');
const StockTransaction = require('./models/StockTranscationmodel');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URL);
  const transactions = await StockTransaction.find().populate('product').populate('supplier');
  fs.writeFileSync('out.json', JSON.stringify(transactions, null, 2));
  process.exit();
}
check();
