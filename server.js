const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
require('dotenv').config();

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
console.log("process.env.CLOUDINARY_API_KEY 12 =>",process.env.CLOUDINARY_API_KEY);
// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON data

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
// Define routes here (e.g., product routes, user routes)

// Set up the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
