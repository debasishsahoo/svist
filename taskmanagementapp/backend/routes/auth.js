const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
router.post('/register')
router.post("/login")
router.get("/verify")
router.post("/logout")
module.exports = router;