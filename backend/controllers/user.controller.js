const fileManager = require("../utils/fileManager");
const { generateResponse } = require("../utils/helper");

const userController = {
  getAllUsers: async (req, res) => {},

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id:", id);

      const users = await fileManager.readData("user.json");
      console.log("users:", users);

      const user = users.find((user) => user.id === parseInt(id));
      if (!user) {
        return res.status(404).json(generateResponse(
          false,
          "User not found",
          null,
          404
        ));
      }
      res.status(200).json(generateResponse(
          true,
          "User found",
          user,
          200
        ));
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json(generateResponse(
          false,
          "Failed to Fetch User",
          null,
          500
        ));
    }
  },
  createUsers: async (req, res) => {},
  updateUsers: async (req, res) => {},
  deleteUsers: async (req, res) => {},
  getUserStats: async (req, res) => {},
};
module.exports = userController;
