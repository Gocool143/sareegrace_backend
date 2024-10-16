const express = require('express');
const { 
    createOrder, 
    getOrderById, 
    updateOrderStatus, 
    getUserOrders, 
    getAllOrders, 
    cancelOrder, 
    updatePaymentStatus,
    verifyPayment,createPayment
  } = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); 
const router = express.Router();

// Create a new order
router.post('/create', createOrder);

router.post('/verify-payment',verifyPayment );

// Get a specific order by ID
router.get('/:orderId', getOrderById);

// Update order status (admin or user)
router.put('/:orderId',  updateOrderStatus);

// Get all orders by a specific user
router.get('/user/:userId',  getUserOrders);

// Cancel an order (by user)
router.put('/:orderId/cancel', cancelOrder);

// Get all orders (admin only)
router.get('/',  getAllOrders);

// Update payment status (admin or webhook)
router.put('/:orderId/payment', updatePaymentStatus);

router.post('/create-razorpay-order', createPayment);
module.exports = router;
