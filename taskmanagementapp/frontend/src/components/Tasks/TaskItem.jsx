import React, { useState } from "react";
import { taskService } from "../../services/taskService";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  isThisWeek,
  formatDistanceToNow,
} from "date-fns";
import "./Tasks.css";

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Handle quick status updates
  const handleStatusChange = async (newStatus) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      onUpdate(); // Refresh the task list
    } catch (error) {
      console.error("Failed to update task status:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle priority updates
  const handlePriorityChange = async (newPriority) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await taskService.updateTask(task._id, { priority: newPriority });
      onUpdate(); // Refresh the task list
    } catch (error) {
      console.error("Failed to update task priority:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Format due date with smart labels
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);

    if (isToday(date)) {
      return { text: "Today", class: "due-today", icon: "🎯" };
    } else if (isTomorrow(date)) {
      return { text: "Tomorrow", class: "due-tomorrow", icon: "📅" };
    } else if (isPast(date)) {
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      return { text: `Overdue (${timeAgo})`, class: "due-overdue", icon: "⚠️" };
    } else if (isThisWeek(date)) {
      return { text: format(date, "EEEE"), class: "due-this-week", icon: "📅" };
    } else {
      return {
        text: format(date, "MMM d, yyyy"),
        class: "due-future",
        icon: "📅",
      };
    }
  };

  // Get priority icon and color
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return { icon: "🔴", label: "High", class: "priority-high" };
      case TASK_PRIORITY.MEDIUM:
        return { icon: "🟡", label: "Medium", class: "priority-medium" };
      case TASK_PRIORITY.LOW:
        return { icon: "🟢", label: "Low", class: "priority-low" };
      default:
        return { icon: "⚪", label: "Unknown", class: "priority-unknown" };
    }
  };

  // Get status icon and info
  const getStatusInfo = (status) => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return { icon: "✅", label: "Completed", class: "status-completed" };
      case TASK_STATUS.IN_PROGRESS:
        return {
          icon: "🔄",
          label: "In Progress",
          class: "status-in-progress",
        };
      case TASK_STATUS.PENDING:
        return { icon: "📋", label: "Pending", class: "status-pending" };
      default:
        return { icon: "❓", label: "Unknown", class: "status-unknown" };
    }
  };

  // Calculate task age
  const getTaskAge = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  // Truncate description for display
  const getTruncatedDescription = (description, maxLength = 150) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const dueDateInfo = formatDueDate(task.dueDate);
  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);
  const taskAge = getTaskAge(task.createdAt);

  // Determine next status for progression button
  const getNextStatus = () => {
    switch (task.status) {
      case TASK_STATUS.PENDING:
        return TASK_STATUS.IN_PROGRESS;
      case TASK_STATUS.IN_PROGRESS:
        return TASK_STATUS.COMPLETED;
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <div
      className={`task-item ${task.status} ${priorityInfo.class} ${
        isUpdating ? "updating" : ""
      }`}
    >
      {/* Task Header */}
      <div className="task-header">
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-badges">
            <span
              className={`badge badge-status ${statusInfo.class}`}
              title={statusInfo.label}
            >
              {statusInfo.icon} {statusInfo.label}
            </span>
            <button
              className={`badge badge-priority ${priorityInfo.class} clickable`}
              onClick={() => {
                const priorities = [
                  TASK_PRIORITY.LOW,
                  TASK_PRIORITY.MEDIUM,
                  TASK_PRIORITY.HIGH,
                ];
                const currentIndex = priorities.indexOf(task.priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                handlePriorityChange(priorities[nextIndex]);
              }}
              disabled={isUpdating}
              title={`Priority: ${priorityInfo.label} (click to change)`}
            >
              {priorityInfo.icon} {priorityInfo.label}
            </button>
          </div>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <div className="task-description">
          <p>
            {showFullDescription
              ? task.description
              : getTruncatedDescription(task.description)}
          </p>
          {task.description.length > 150 && (
            <button
              className="btn-link description-toggle"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Task Metadata */}
      <div className="task-meta">
        {dueDateInfo && (
          <span
            className={`task-meta-item due-date ${dueDateInfo.class}`}
            title="Due date"
          >
            {dueDateInfo.icon} {dueDateInfo.text}
          </span>
        )}

        <span className="task-meta-item created-date" title="Created date">
          🗓️ Created {taskAge}
        </span>

        {task.completedAt && (
          <span
            className="task-meta-item completed-date"
            title="Completion date"
          >
            ✅ Completed{" "}
            {formatDistanceToNow(new Date(task.completedAt), {
              addSuffix: true,
            })}
          </span>
        )}

        {task.updatedAt && task.updatedAt !== task.createdAt && (
          <span className="task-meta-item updated-date" title="Last updated">
            📝 Updated{" "}
            {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
          </span>
        )}
      </div>

      {/* Task Actions */}
      <div className="task-actions">
        {/* Quick Status Actions */}
        <div className="status-actions">
          {task.status !== TASK_STATUS.COMPLETED && nextStatus && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              className={`btn btn-small ${
                nextStatus === TASK_STATUS.IN_PROGRESS
                  ? "btn-primary"
                  : "btn-success"
              }`}
              disabled={isUpdating}
              title={`Mark as ${nextStatus.replace("-", " ")}`}
            >
              {nextStatus === TASK_STATUS.IN_PROGRESS ? (
                <>🚀 Start</>
              ) : (
                <>✅ Complete</>
              )}
            </button>
          )}

          {task.status === TASK_STATUS.COMPLETED && (
            <button
              onClick={() => handleStatusChange(TASK_STATUS.PENDING)}
              className="btn btn-small btn-secondary"
              disabled={isUpdating}
              title="Reopen task"
            >
              🔄 Reopen
            </button>
          )}

          {task.status === TASK_STATUS.IN_PROGRESS && (
            <button
              onClick={() => handleStatusChange(TASK_STATUS.PENDING)}
              className="btn btn-small btn-outline btn-secondary"
              disabled={isUpdating}
              title="Move back to pending"
            >
              ⏸️ Pause
            </button>
          )}
        </div>

        {/* CRUD Actions */}
        <div className="crud-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn btn-small btn-outline btn-primary"
            disabled={isUpdating}
            title="Edit task"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
                )
              ) {
                onDelete(task._id);
              }
            }}
            className="btn btn-small btn-danger"
            disabled={isUpdating}
            title="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="task-updating-overlay" aria-label="Updating task">
          <div className="spinner"></div>
          <span className="updating-text">Updating...</span>
        </div>
      )}

      {/* Progress Indicator for Visual Feedback */}
      <div className="task-progress-indicator">
        <div className={`progress-bar progress-${task.status}`}></div>
      </div>
    </div>
  );
};

export default TaskItem;
