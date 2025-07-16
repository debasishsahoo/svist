const fileManager = require("../utils/fileManager");

const userController = {
  getUserById: async (req, res) => {
    try {
  const {id}=req.param;
  const users=await fileManager.readFile("users.json");
  const user = users.find(user => user.id === parseInt(id));
  if(!user){
    return res.status(404).json({ message: "User not found",data:null });
  }
  res.status(200).json({message: "User found",data: user });

    } catch (error) {
     res.status(500).json({message: "Failed to fetch user",data: null }); 
    }
  },
};
module.exports = userController;
