const {
  validateEmail,
  validateRequired,
  generateResponse,
} = require("../utils/helper");

const validateUser = (req, res, next) => {
  const { name, email, age, role } = req.body;

  // Check required fields
  const requiredFields = ["name", "email"];
  const missing = validateRequired(requiredFields, req.body);

  if (missing) {
    return res
      .status(400)
      .json(
        generateResponse(
          false,
          `Missing required fields: ${missing.join(", ")}`,
          null,
          400
        )
      );
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json(generateResponse(false, "Invalid email format", null, 400));
  }

  // Validate age if provided
  if (age && (typeof age !== "number" || age < 0 || age > 120)) {
    return res
      .status(400)
      .json(
        generateResponse(
          false,
          "Age must be a number between 0 and 120",
          null,
          400
        )
      );
  }

  // Validate role if provided
  if (role && !["admin", "user", "moderator"].includes(role)) {
    return res
      .status(400)
      .json(
        generateResponse(
          false,
          "Role must be one of: admin, user, moderator",
          null,
          400
        )
      );
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;

  // Check required fields
  const requiredFields = ["name", "price", "category"];
  const missing = validateRequired(requiredFields, req.body);

  if (missing) {
    return res
      .status(400)
      .json(
        generateResponse(
          false,
          `Missing required fields: ${missing.join(", ")}`,
          null,
          400
        )
      );
  }

  // Validate price
  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json(
        generateResponse(false, "Price must be a positive number", null, 400)
      );
  }

  // Validate category
  const validCategories = [
    "electronics",
    "home",
    "clothing",
    "books",
    "sports",
  ];

  if (!validCategories.includes(category)) {
    return res
      .status(400)
      .json(
        generateResponse(
          false,
          `Category must be one of: ${validCategories.join(", ")}`,
          null,
          400
        )
      );
  }

  next();
};

module.exports = {
  validateUser,
  validateProduct,
};
