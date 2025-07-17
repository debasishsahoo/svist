const generateResponse = (success, message, data = null, statusCode = 200) => {
  return {
    success,
    message,
    data,
    statusCode,
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
const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedData = array.slice(offset, offset + limit);
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit,
      hasNext: offset + limit < array.length,
      hasPrev: page > 1,
    },
  };
};


module.exports = {
  paginate,
  generateResponse,
  validateEmail,
  validateRequired,
};
