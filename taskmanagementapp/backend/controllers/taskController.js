const Task = require("../models/Task");

exports.getAllTask = async (req, res) => {};
exports.getSingleTask = async (req, res) => {};
exports.createTask = async (req, res) => {
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
};
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task fields
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};
exports.toggleTask = async (req, res) => {};
exports.deleteTask = async (req, res) => {};
exports.stats = async (req, res) => {};
