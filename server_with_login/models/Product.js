const mongoose = require('mongoose');

// Variant schema
const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  stock: { type: Number, default: 0 },
  sku: String
});

// Review schema
const reviewSchema = new mongoose.Schema({
  user: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true },
  brand: String,
  category: String,
  sku: String,
  stock: { type: Number, default: 0 },
  variants: [variantSchema],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
