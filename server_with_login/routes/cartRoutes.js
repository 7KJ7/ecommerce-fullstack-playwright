
const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  checkoutCart
} = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart); 
router.post('/', protect, async (req, res, next) => {
  try {
    await addToCart(req, res, next);
    // ✅ Return a consistent response message
    res.json({ message: 'Item added to cart successfully' });
  } catch (err) {
    next(err);
  }
});
router.delete('/:productId', protect, removeFromCart);
router.post('/checkout', protect, checkoutCart);

module.exports = router;
