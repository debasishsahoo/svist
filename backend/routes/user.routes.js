const router = require("express").Router();
const { validateUser } = require('../middleware/validation.middleware');
const userController = require("../controllers/user.controller");
const {
  authenticateToken,
  authorize,
} = require("../middleware/auth.middleware");

// Public routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

// Protected routes (require authentication)
router.post("/", authenticateToken, validateUser, userController.createUsers);
router.put("/:id", authenticateToken, validateUser, userController.updateUsers);

// Admin only routes
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  userController.deleteUsers
);

module.exports = router;
