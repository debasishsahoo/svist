import React, { useState, useEffect } from "react";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import { format } from "date-fns";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./Tasks.css";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || TASK_STATUS.PENDING,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate
          ? format(new Date(task.dueDate), "yyyy-MM-dd")
          : "",
      });
    } else {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        status: TASK_STATUS.PENDING,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: "",
      });
    }
    // Clear errors when task changes
    setValidationErrors({});
    setError(null);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error when user makes changes
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    } else if (formData.title.length > 100) {
      errors.title = "Title cannot exceed 100 characters";
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }

    // Due date validation
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(dueDate.getTime())) {
        errors.dueDate = "Please enter a valid date";
      } else if (dueDate < today) {
        errors.dueDate = "Due date cannot be in the past";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});
    setError(null);

    try {
      const submitData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || undefined,
      };

      await onSubmit(submitData);

      // If we reach here, submission was successful
      // The parent component will handle closing the form
    } catch (error) {
      console.error("Task submission error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return; // Prevent cancel during submission

    // Check if form has unsaved changes
    const hasChanges = task
      ? formData.title !== (task.title || "") ||
        formData.description !== (task.description || "") ||
        formData.status !== (task.status || TASK_STATUS.PENDING) ||
        formData.priority !== (task.priority || TASK_PRIORITY.MEDIUM) ||
        formData.dueDate !==
          (task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "")
      : formData.title.trim() !== "" ||
        formData.description.trim() !== "" ||
        formData.status !== TASK_STATUS.PENDING ||
        formData.priority !== TASK_PRIORITY.MEDIUM ||
        formData.dueDate !== "";

    if (
      hasChanges &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      )
    ) {
      return;
    }

    onCancel();
  };

  const getTodayDate = () => {
    return format(new Date(), "yyyy-MM-dd");
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{task ? "Edit Task" : "Create New Task"}</h2>
        <button
          onClick={handleCancel}
          className="btn btn-secondary btn-small"
          disabled={isSubmitting}
          aria-label="Close form"
        >
          ×
        </button>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        {/* Task Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-control ${validationErrors.title ? "error" : ""}`}
            placeholder="Enter a descriptive task title"
            maxLength={100}
            disabled={isSubmitting}
            autoFocus={!task} // Auto-focus for new tasks
          />
          {validationErrors.title && (
            <div className="form-error" role="alert">
              {validationErrors.title}
            </div>
          )}
          <div className="character-count">{formData.title.length}/100</div>
        </div>

        {/* Task Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-control ${
              validationErrors.description ? "error" : ""
            }`}
            placeholder="Add more details about this task (optional)"
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
          {validationErrors.description && (
            <div className="form-error" role="alert">
              {validationErrors.description}
            </div>
          )}
          <div className="character-count">
            {formData.description.length}/500
          </div>
        </div>

        {/* Status and Priority Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
              disabled={isSubmitting}
            >
              <option value={TASK_STATUS.PENDING}>📋 Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>🔄 In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>✅ Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-control"
              disabled={isSubmitting}
            >
              <option value={TASK_PRIORITY.LOW}>🟢 Low</option>
              <option value={TASK_PRIORITY.MEDIUM}>🟡 Medium</option>
              <option value={TASK_PRIORITY.HIGH}>🔴 High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`form-control ${
              validationErrors.dueDate ? "error" : ""
            }`}
            min={getTodayDate()}
            disabled={isSubmitting}
          />
          {validationErrors.dueDate && (
            <div className="form-error" role="alert">
              {validationErrors.dueDate}
            </div>
          )}
          <div className="form-help">
            Leave empty if no specific due date is required
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" message="" />
                <span style={{ marginLeft: "8px" }}>
                  {task ? "Updating..." : "Creating..."}
                </span>
              </>
            ) : task ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </form>

      {/* Form Help Text */}
      <div className="form-help-section">
        <small className="form-help">
          <strong>Tips:</strong>
          <ul>
            <li>Use clear, actionable titles for your tasks</li>
            <li>Add descriptions for complex tasks that need more context</li>
            <li>Set due dates to help prioritize your work</li>
            <li>Use priority levels to focus on what matters most</li>
          </ul>
        </small>
      </div>
    </div>
  );
};

export default TaskForm;
