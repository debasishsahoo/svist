const Task = require("../models/Task");

exports.getAllTask = async (req, res) => {
    try {
    const {
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sort);

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};
exports.getSingleTask = async (req, res) => {
    try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};
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
exports.toggleTask = async (req, res) => {
    try {
    const taskId = req.params.id;
    
    // Validate ObjectId format
    if (!taskId || !taskId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findOne({ 
      _id: taskId, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Toggle status
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ message: 'Server error while toggling task' });
  }
};
exports.deleteTask = async (req, res) => {
    try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};
exports.stats = async (req, res) => {
    try {
    const userId = req.user._id;

    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments({ user: userId });
    const overdueTasks = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    const formattedStats = {
      total: totalTasks,
      overdue: overdueTasks,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };

    res.json(formattedStats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
};
