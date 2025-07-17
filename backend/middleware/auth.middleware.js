const jwt = require("jsonwebtoken");
const { generateResponse } = require("../utils/helper");
//Configuration file
const config = require("config");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json(generateResponse(false, "Access token required", null, 401));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET ||
      config.get("auth.jwt_secret") ||
      "87b4539bddbfc5e6a1a62c87acba28187224",
    (err, user) => {
      if (err) {
        return res
          .status(403)
          .json(generateResponse(false, "Invalid or expired token", null, 403));
      }
      req.user = user;
      next();
    }
  );
};

const login = (req, res) => {
  const { email, password } = req.body;
  // Simple mock authentication
  if (email === "admin@example.com" && password === "admin123") {
    const token = jwt.sign(
      { id: 1, email, role: "admin" },
      process.env.JWT_SECRET ||
        config.get("auth.jwt_secret") ||
        "87b4539bddbfc5e6a1a62c87acba28187224",
      { expiresIn: "15m" }
    );
    res.json(generateResponse(true, "Login successful", { token }));
  } else {
    res
      .status(401)
      .json(generateResponse(false, "Invalid credentials", null, 401));
  }
};

module.exports = {
  authenticateToken,
  login,
};
