const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

//Configuration file
const config = require('config');
require('dotenv').config();

// Importing  routes
const userRoutes = require('./routes/user.routes');

// Import middleware
const { requestLogger } = require("./middleware/logger.middleware");
const { login } = require("./middleware/auth.middleware");
  
const app = express();
const PORT = process.env.PORT || config.get('server.port') || 3000;
const HOST = process.env.HOST || config.get('server.host') || 'localhost';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.post("/api/auth/login", login);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    statusCode: 404,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    statusCode: 500,
  });
});


app.listen(PORT, HOST, () => {
  console.log(`Server started and running on http://${HOST}:${PORT}`);
});