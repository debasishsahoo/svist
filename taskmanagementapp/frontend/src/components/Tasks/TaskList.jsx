import React, { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./Tasks.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (err) {
      setError("Failed to create task");
    }
  };

 const handleUpdateTask = async (taskId, taskData) => {
  try {
    const updatedTask = await taskService.updateTask(taskId, taskData);
    setTasks(tasks.map(task => 
      (task._id || task.id) === taskId ? updatedTask : task
    ));
    setEditingTask(null);
  } catch (err) {
    setError('Failed to update task');
  }
};

 const handleDeleteTask = async (taskId) => {
  try {
    await taskService.deleteTask(taskId);
    setTasks(tasks.filter(task => (task._id || task.id) !== taskId));
  } catch (err) {
    setError('Failed to delete task');
  }
};

 const handleToggleComplete = async (taskId) => {
  try {
    const updatedTask = await taskService.toggleTaskComplete(taskId);
    setTasks(tasks.map(task => 
      (task._id || task.id) === taskId ? updatedTask : task
    ));
  } catch (err) {
    setError('Failed to update task status');
  }
};

  if (loading) return <LoadingSpinner />;

  return (
    <div className="task-list-container">
      <div className="task-header">
        <h1>My Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Task
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
           onSubmit={(data) => handleUpdateTask(editingTask._id || editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks yet. Create your first task!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDeleteTask(task._id || task.id)}
              onToggleComplete={() => handleToggleComplete(task._id || task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
