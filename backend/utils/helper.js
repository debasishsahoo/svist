const generateResponse = (success, message, data = null, statusCode = 200) => {
  return {
    Success: success,
    Message: message,
    Data: data,
    Status: statusCode,
    timestamp: new Date().toISOString(),
  };
};
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const validateRequired = (fields, body) => {
  const missing = fields.filter((field) => !body[field]);
  return missing.length > 0 ? missing : null;
};

module.exports = {
  generateResponse,
  validateEmail,
  validateRequired,
};
