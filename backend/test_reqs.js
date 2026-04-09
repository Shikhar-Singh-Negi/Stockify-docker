const path = require('path');
const fs = require('fs');

const requirements = [
  './libs/mongoconfig',
  './Routers/authRouther',
  './Routers/ProductRouter',
  './Routers/orderRouter',
  './Routers/categoryRouter',
  './Routers/notificationRouters',
  './Routers/activityRouter',
  './Routers/inventoryRouter',
  './Routers/salesRouter',
  './Routers/supplierrouter',
  './Routers/stocktransactionrouter'
];

requirements.forEach(req => {
  try {
    require(req);
    console.log(`OK: ${req}`);
  } catch (e) {
    console.log(`FAIL: ${req}`);
    console.log(e.message);
  }
});
