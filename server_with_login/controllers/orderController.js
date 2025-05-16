
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// GET /api/orders
exports.getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
  res.json(orders);
};

// POST /api/orders/pay
exports.createOrderAfterPayment = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: 'Cart is empty' });

  const order = new Order({
    userId: req.user.id,
    items: cart.items
  });

  await order.save();
  await Cart.deleteOne({ userId: req.user.id });

  res.json({ message: 'Order saved after payment', order });
};

// DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  const result = await Order.deleteOne({ _id: id, userId: req.user.id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Order not found or unauthorized' });
  }

  res.json({ message: 'Order deleted' });
};
