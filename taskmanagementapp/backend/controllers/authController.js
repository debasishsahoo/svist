const User = require("../models/User");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validation");

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
  } catch (error) {}
};
























exports.login = async (req, res) => {};
exports.logout = async (req, res) => {};
exports.getProfile = async (req, res) => {};
exports.updateProfile = async (req, res) => {};
exports.updatePassword = async (req, res) => {};
exports.deleteAccount = async (req, res) => {};
