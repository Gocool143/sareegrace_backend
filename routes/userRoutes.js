const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
} = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); 
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// isAuthenticateded routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);
router.post("/wishlist", isAuthenticated, addToWishlist);
router.delete("/wishlist", isAuthenticated, removeFromWishlist);
router.post("/cart", isAuthenticated, addToCart);
router.delete("/cart", isAuthenticated, removeFromCart);

module.exports = router;
