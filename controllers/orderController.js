const Order = require('../models/Order'); // Assuming you've created an Order model
const Product = require('../models/Product'); // For checking stock, etc.
const Razorpay = require('razorpay');
const crypto = require('crypto');
// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_ivWzdPIycsYIPZ',
  key_secret: 'tjcAq3O7zsmi6WpghuEM4sYI',
});
// Create a new order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
console.log("req.body =>",req.body);
console.log("shippingAddress=>",shippingAddress);

    const order = new Order({
      userId: '66f7ec95cb9dacb7c96599af', // Assuming req.user contains authenticated user data
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderStatus: 'pending',
      paymentStatus: 'pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log("error =>",error);
    
    res.status(400).json({ message: 'Failed to create order', error });
  }
};
const createPayment = async (req, res) => {
  try {
    console.log("req.body =>",req.body);
    
    const { amount } = req.body;
console.log("amount =>",amount);
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Amount is in paisa (INR), so multiply by 100
      currency: "INR",
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
}
const verifyPayment = async  (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    // Step 1: Create the signature string using Razorpay order ID and payment ID
    const body = `${orderId}|${paymentId}`;

    // Step 2: Generate the expected signature using your Razorpay secret
    const expectedSignature = crypto
      .createHmac('sha256', 'tjcAq3O7zsmi6WpghuEM4sYI')
      .update(body.toString())
      .digest('hex');
console.log("expectedSignature =>",expectedSignature);

    // Step 3: Compare the expected signature with the signature received from Razorpay
    if (expectedSignature === signature) {
      // Payment verification success
      // Here, you can update the order status in your database if required
      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      // Verification failed
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error in verifying payment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

};
// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve order', error });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    const updatedOrder = await order.save();
    res.status(200).json({ message: 'Order status updated', updatedOrder });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order status', error });
  }
};

// Get orders by user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve orders', error });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve all orders', error });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be canceled' });
    }

    order.orderStatus = 'canceled';
    const canceledOrder = await order.save();
    res.status(200).json({ message: 'Order canceled', canceledOrder });
  } catch (error) {
    res.status(400).json({ message: 'Failed to cancel order', error });
  }
};

// Update payment status (usually from a payment gateway webhook or admin)
const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    order.paymentDetails = req.body.paymentDetails || order.paymentDetails;

    const updatedOrder = await order.save();
    res.status(200).json({ message: 'Payment status updated', updatedOrder });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update payment status', error });
  }
};

module.exports = {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
    cancelOrder,
    updatePaymentStatus,
    verifyPayment,
    createPayment
};