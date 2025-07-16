const userController = {
  allUsers: async (req, res) => { 
    try {
      // Logic to fetch all users
      res.status(200).json({ message: "All users fetched successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
  singleUser: async (req, res) => {
    try {
      // Logic to fetch a single user
      res.status(200).json({
        message: "Single user fetched successfully",
        id: req.params.id,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
};
module.exports = userController;
