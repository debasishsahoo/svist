const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Task = require("../models/Task");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/taskmanager"
    );
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("Cleared existing data");

    // Drop indexes that might be causing issues
    try {
      await User.collection.dropIndexes();
      console.log("Dropped existing indexes");
    } catch (error) {
      console.log("No indexes to drop or error dropping indexes");
    }

    // Create demo users one by one to handle duplicates better
    const users = [];

    try {
      const user1 = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
      await user1.save();
      users.push(user1);
      console.log("Created user: John Doe");
    } catch (error) {
      console.log("Error creating John Doe:", error.message);
    }

    try {
      const user2 = new User({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
      });
      await user2.save();
      users.push(user2);
      console.log("Created user: Jane Smith");
    } catch (error) {
      console.log("Error creating Jane Smith:", error.message);
    }

    if (users.length === 0) {
      console.log("No users created, skipping task creation");
      return;
    }

    // Create demo tasks
    const tasks = [
      {
        title: "Complete project proposal",
        description: "Write and submit the quarterly project proposal",
        status: "in_progress",
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user: users[0]._id,
      },
      {
        title: "Review team performance",
        description: "Conduct monthly performance reviews for team members",
        status: "pending",
        priority: "medium",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        user: users[0]._id,
      },
      {
        title: "Update website content",
        description: "Refresh the company website with new content and images",
        status: "completed",
        priority: "low",
        completedAt: new Date(),
        user: users[0]._id,
      },
    ];

    if (users.length > 1) {
      tasks.push(
        {
          title: "Plan marketing campaign",
          description: "Develop strategy for Q2 marketing campaign",
          status: "pending",
          priority: "high",
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          user: users[1]._id,
        },
        {
          title: "Organize team building event",
          description: "Plan and coordinate quarterly team building activities",
          status: "in_progress",
          priority: "medium",
          user: users[1]._id,
        }
      );
    }

    await Task.insertMany(tasks);
    console.log("Created demo tasks");

    console.log("Seeding completed successfully!");
    console.log("Demo credentials:");
    console.log("Email: john@example.com, Password: password123");
    if (users.length > 1) {
      console.log("Email: jane@example.com, Password: password123");
    }
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
