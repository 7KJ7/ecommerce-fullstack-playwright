
const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  const {
    name, description, image, price, brand, category, sku, stock, variants
  } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      image,
      price,
      brand,
      category,
      sku,
      stock,
      variants
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
