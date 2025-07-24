const Task = require("../models/Task");

exports.getAllTask= async (req, res) => {
    
}
exports.getSingleTask= async (req, res) => {}
exports.createTask= async (req, res) => {
     try {
    const taskData = {
      ...req.body,
      user: req.user._id,
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
}
exports.updateTask= async (req, res) => {}
exports.toggleTask= async (req, res) => {}
exports.deleteTask= async (req, res) => {}
exports.stats= async (req, res) => {}
