const jwt = require("jsonwebtoken");

const generateToken = ()=>{}
const verifyToken = (token) => {}
const formatErrorResponse = (message, statusCode = 500) => {}
const formatSuccessResponse = (data, message = "Success") => {}
const getPagination = (page, size) => {}
const getPaginationMetadata = (page, limit, totalItems) => {}

module.exports = {
  generateToken,
  verifyToken,
  formatErrorResponse,
  formatSuccessResponse,
  getPagination,
  getPaginationMetadata,
};

