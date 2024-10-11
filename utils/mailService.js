// mailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
// Configure the transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use Gmail, Outlook, or your SMTP server
  auth: {
    user: process.env.EMAIL_USER, // Your email address (use environment variable)
    pass: process.env.EMAIL_PASS, // Your email password (use environment variable)
  },
});

console.log("process.env.EMAIL_USER =>",process.env.EMAIL_USER);

const sendOrderConfirmationEmail = async (customerEmail, orderDetails) => {
    const { orderId, totalAmount, shippingAddress } = orderDetails;
    const fullAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.pincode}, ${shippingAddress.country}`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: customerEmail, // Receiver email
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Total Amount: <strong>₹${totalAmount}</strong></p>
        <p>Delivery Address:</p>
        <p><strong>${fullAddress}</strong></p>
        <p>Your order will be delivered soon. Thank you for shopping with us!</p>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
       // Email content for the admin
       const adminEmails = process.env.ADMIN_EMAILS.split(',');
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails, // Admin email (defined in your environment variables)
        subject: `New Order Placed - Order ID: ${orderId}`,
        html: `
          <h1>New Order Received</h1>
          <p>An order has been placed. Here are the details:</p>
          <p>Order ID: ${orderId}</p>
          <p>Customer: ${customerEmail}</p>
          <p>Shipping Address: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.pincode}, ${shippingAddress.country}</p>
          <p>Total Amount: ₹${totalAmount}</p>
        `
      };
  
      // Send email to admin
      await transporter.sendMail(adminMailOptions);
      console.log('Order confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  };
  
  module.exports = { sendOrderConfirmationEmail};