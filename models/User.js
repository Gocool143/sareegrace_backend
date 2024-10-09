const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
  },
  phoneNumber: { type: String },
  role: { type: String, default: 'customer' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;


// POST /api/users/create
// Content-Type: application/json

// {
//   "firstName": "John",
//   "lastName": "Doe",
//   "email": "johndoe@example.com",
//   "password": "SecurePassword123",
//   "phone": "+1234567890",
//   "role": "customer",
//   "address": {
//     "street": "123 Main St",
//     "city": "New York",
//     "state": "NY",
//     "postalCode": "10001",
//     "country": "USA"
//   }
// }