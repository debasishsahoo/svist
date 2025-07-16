const fileManager = require("../utils/fileManager");

const userController = {
  getUserById: async (req, res) => {
    try {
  const {id}=req.params;
  console.log('id:', id)

  const users=await fileManager.readData("user.json");
  console.log('users:', users)

  const user = users.find(user => user.id === parseInt(id));
  if(!user){
    return res.status(404).json({ message: "User not found",data:null });
  }
  res.status(200).json({message: "User found",data: user });

    } catch (error) {
      console.error("Error fetching user:", error);
     res.status(500).json({message: "Failed to fetch user",data: null }); 
    }
  },
};
module.exports = userController;
