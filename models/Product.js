const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    default: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
// POST /api/products/create
// Content-Type: application/json

// {
//   "name": "Silk Saree",
//   "description": "A beautiful silk saree with intricate embroidery.",
//   "price": 4500,
//   "originalPrice": 5000,
//   "category": "650f84b3c72e4b00271e4b7d",
//   "stock": 20,
//   "sold": 5,
//   "images": [
//     { "url": "https://example.com/images/silk-saree-front.jpg" },
//     { "url": "https://example.com/images/silk-saree-back.jpg" }
//   ]
// }