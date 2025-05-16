
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      qty: { type: Number, default: 1 },
    }
  ],
  orders: [
    {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          qty: Number
        }
      ],
      createdAt: Date
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
