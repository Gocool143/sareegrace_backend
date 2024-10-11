const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: false },
      image: { type: String, required: false },
      price: { type: Number, required: false },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: false },
    city: { type: String, required: false },
    pincode: { type: String, required: false },
    country: { type: String, required: false },
  },
  paymentMethod: {
    type: String,
    required: false,
  },
  itemsPrice: {
    type: Number,
    required: false,
  },
  shippingPrice: {
    type: Number,
    required: false,
  },
  totalPrice: {
    type: Number,
    required: false,
  },
  isPaid: {
    type: Boolean,
    required: false,
    default: false,
  },
  paidAt: {
    type: Date,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
