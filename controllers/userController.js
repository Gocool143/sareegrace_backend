const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, phoneNumber, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phoneNumber, address },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter((item) => item.productId.toString() !== productId);

    await user.save();

    res.status(200).json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
