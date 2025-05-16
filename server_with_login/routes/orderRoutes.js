
const express = require('express');
const router = express.Router();
const { getOrders, createOrderAfterPayment, deleteOrder } = require('../controllers/orderController');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');






router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orders.items.productId');
    res.json(user.orders || []);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router.post('/pay', protect, async (req, res) => {
  try {
    console.log("➡️ Payment started");

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("❌ No user found");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log("✅ User found:", user.email);

    if (!user.cart || user.cart.length === 0) {
      console.log("❌ Empty cart");
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log("🛒 Cart contents:", user.cart);

    user.orders.push({
      items: user.cart.map(item => ({
        productId: item.productId,
        qty: item.qty
      })),
      createdAt: new Date()
    });

    user.cart = [];
    await user.save();

    console.log("✅ Order saved");

    res.json({ message: 'Payment successful' });
  } catch (err) {
    console.error("💥 Payment error:", err);
    res.status(500).json({ message: 'Payment failed' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    user.orders = user.orders.filter(
      order => order._id.toString() !== req.params.id
    );

    await user.save();
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error("❌ Erreur suppression commande :", err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});            // Delete one order

module.exports = router;
