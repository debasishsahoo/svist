const fileManager = require("../utils/fileManager");
const { generateResponse } = require("../utils/helper");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      let users = await fileManager.readData("user.json");
      res.json(generateResponse(true, "Users retrieved successfully", result));
    } catch (error) {
       res
        .status(500)
        .json(generateResponse(false, "Failed to fetch users", null, 500));
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id:", id);

      const users = await fileManager.readData("user.json");
      console.log("users:", users);

      const user = users.find((user) => user.id === parseInt(id));
      if (!user) {
        return res
          .status(404)
          .json(generateResponse(false, "User not found", null, 404));
      }
      res.status(200).json(generateResponse(true, "User found", user, 200));
    } catch (error) {
      console.error("Error fetching user:", error);
      res
        .status(500)
        .json(generateResponse(false, "Failed to Fetch User", null, 500));
    }
  },
  createUsers: async (req, res) => {
    try {
      const userData = {
        ...req.body,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      };

      // Check if email already exists
      const users = await fileManager.readData("user.json");
      const existingUser = users.find((u) => u.email === userData.email);

      if (existingUser) {
        return res
          .status(400)
          .json(generateResponse(false, "Email already exists", null, 400));
      }

      const newUser = await fileManager.appendData("user.json", userData);

      res
        .status(201)
        .json(
          generateResponse(true, "User created successfully", newUser, 201)
        );
    } catch (error) {
      res
        .status(500)
        .json(generateResponse(false, "Failed to create user", null, 500));
    }
  },
  updateUsers: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // Check if email already exists (if updating email)
      if (updateData.email) {
        const users = await fileManager.readData("user.json");
        const existingUser = users.find(
          (u) => u.email === updateData.email && u.id === parseInt(id) //! ==
        );

        if (existingUser) {
          return res
            .status(400)
            .json(generateResponse(false, "Email already exists", null, 400));
        }
      }
      const updatedUser = await fileManager.updateData(
        "user.json",
        id,
        updateData
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json(generateResponse(false, "User not found", null, 404));
      }
      res.json(
        generateResponse(true, "User updated successfully", updatedUser, 200)
      );
    } catch (error) {
      res
        .status(500)
        .json(generateResponse(false, "Failed to update user", null, 500));
    }
  },
  deleteUsers: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await fileManager.deleteData("user.json", id);

      if (!deletedUser) {
        return res
          .status(404)
          .json(generateResponse(false, "User not found", null, 404));
      }
      res.json(
        generateResponse(true, "User deleted successfully", deletedUser)
      );
    } catch (error) {
      res
        .status(500)
        .json(generateResponse(false, "Failed to delete user", null, 500));
    }
  },
  getUserStats: async (req, res) => {},
};
module.exports = userController;
