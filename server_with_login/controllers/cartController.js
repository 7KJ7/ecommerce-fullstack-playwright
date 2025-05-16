
const User = require('../models/User');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.productId');
  res.json({ items: user.cart });
};

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, qty } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingItem = user.cart.find(item =>
      item.productId.equals(product._id)
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      user.cart.push({ productId: product._id, qty });
    }

    await user.save();

    res.json({ message: 'Item added to cart successfully', cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
  await user.save();
  res.json({ message: 'Item removed from cart' });
};

const checkoutCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = [];
  await user.save();
  res.json({ message: 'Checkout complete' });
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  checkoutCart
};
