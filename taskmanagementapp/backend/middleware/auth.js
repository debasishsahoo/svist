const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate=async(req,res,next)=>{
    try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log('token:', token)

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded:', decoded)
    const user = await User.findById(decoded.id);
    console.log('user:', user)

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: "Invalid token or user inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    res.status(500).json({ message: "Server error during authentication." });
  }
}


module.exports={authenticate}