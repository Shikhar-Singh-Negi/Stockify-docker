const Notification = require("../models/Notificationmodel");

const checkLowStock = async (product, io) => {
  if (product.quantity <= product.lowStockThreshold) {
    const notificationName = `Low stock alert: ${product.name} (Quantity: ${product.quantity})`;
    
    // Check if a similar notification already exists to avoid duplicates (optional, but good practice)
    const existingNotification = await Notification.findOne({
      name: notificationName,
      read: false
    });

    if (!existingNotification) {
      const notification = new Notification({
        name: notificationName,
        type: "Low Stock"
      });
      await notification.save();

      if (io) {
        io.emit("newNotification", notification);
      }
      return notification;
    }
  }
  return null;
};

module.exports = { checkLowStock };
