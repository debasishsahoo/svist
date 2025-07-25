import React from "react";
import { TASK_PRIORITY, TASK_STATUS } from "../../utils/constants";
import "./Tasks.css";

function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return "priority-high";
      case TASK_PRIORITY.MEDIUM:
        return "priority-medium";
      case TASK_PRIORITY.LOW:
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return "status-completed";
      case TASK_STATUS.IN_PROGRESS:
        return "status-in-progress";
      case TASK_STATUS.PENDING:
        return "status-pending";
      default:
        return "status-pending";
    }
  };

  // Use _id instead of id for MongoDB
  const taskId = task._id || task.id;

  return (
    <div className={`task-item ${getStatusClass(task.status)}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status.replace("_", " ")}
        </span>
        {task.dueDate && (
          <span className="due-date">Due: {formatDate(task.dueDate)}</span>
        )}
      </div>

      <div className="task-actions">
        <button
          className={`btn ${
            task.status === TASK_STATUS.COMPLETED
              ? "btn-secondary"
              : "btn-success"
          }`}
          onClick={() => onToggleComplete(taskId)}
        >
          {task.status === TASK_STATUS.COMPLETED ? "Undo" : "Complete"}
        </button>
        <button className="btn btn-primary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(taskId)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
