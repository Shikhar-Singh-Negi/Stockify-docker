const Inventory = require("../models/Inventorymodel");

const syncInventory = async (productId, quantity) => {
  try {
    let inventory = await Inventory.findOne({ product: productId });
    if (inventory) {
      inventory.quantity = quantity;
      inventory.lastUpdated = Date.now();
      await inventory.save();
    } else {
      inventory = new Inventory({
        product: productId,
        quantity: quantity,
        lastUpdated: Date.now()
      });
      await inventory.save();
    }
    return inventory;
  } catch (error) {
    console.error("Inventory Sync Error:", error);
    return null;
  }
};

module.exports = { syncInventory };
