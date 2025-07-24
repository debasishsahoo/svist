const User = require("../models/User");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validation");
const { generateToken } = require("../utils/helpers");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken({ id: user._id });
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: "Account is deactivated" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({id:user._id});

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
exports.logout = async (req, res) => {};
exports.getProfile = async (req, res) => {};
exports.updateProfile = async (req, res) => {};
exports.updatePassword = async (req, res) => {};
exports.deleteAccount = async (req, res) => {};
