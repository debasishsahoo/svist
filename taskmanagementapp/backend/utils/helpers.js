const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE)=>{
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}






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

