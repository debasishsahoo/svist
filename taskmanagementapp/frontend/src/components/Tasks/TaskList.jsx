import React, { useState, useEffect, useCallback } from "react";
import { taskService } from "../../services/taskService";
import {
  TASK_STATUS,
  TASK_PRIORITY,
  SORT_OPTIONS,
} from "../../utils/constants";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./Tasks.css";

const TaskList = () => {
  // Task data state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and search state
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounced search to avoid too many API calls
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Load tasks and stats on component mount and when filters/pagination change
  useEffect(() => {
    loadTasks();
  }, [filters, pagination.currentPage]);

  // Load stats separately to avoid repeated calls
  useEffect(() => {
    loadStats();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (filters.search !== "") {
        loadTasks();
      }
    }, 300); // 300ms delay

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [filters.search]);

  const loadTasks = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        setError(null);

        const params = {
          ...filters,
          page: pagination.currentPage,
          limit: pagination.limit,
        };

        // Remove empty filter values to clean up API call
        Object.keys(params).forEach((key) => {
          if (
            params[key] === "" ||
            params[key] === null ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        const response = await taskService.getTasks(params);

        setTasks(response.data.tasks);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load tasks. Please try again."
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [filters, pagination.currentPage, pagination.limit]
  );

  const loadStats = async () => {
    try {
      const response = await taskService.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
      // Don't show error for stats as it's not critical
    }
  };

  // Refresh both tasks and stats
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([loadTasks(false), loadStats()]);
  };

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      setShowForm(false);
      setEditingTask(null);

      // Refresh data and reset to first page if not already there
      if (pagination.currentPage !== 1) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      } else {
        await refreshData();
      }

      // Show success feedback
      showSuccessMessage("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error; // Re-throw to let TaskForm handle the error
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(editingTask._id, taskData);
      setEditingTask(null);
      setShowForm(false);
      await refreshData();
      showSuccessMessage("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error; // Re-throw to let TaskForm handle the error
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      await refreshData();
      showSuccessMessage("Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete task. Please try again."
      );
    }
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  // Handle page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));

      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      search: "",
      sortBy: "createdAt",
      order: "desc",
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.status ||
      filters.priority ||
      filters.search ||
      filters.sortBy !== "createdAt" ||
      filters.order !== "desc"
    );
  };

  // Show success message (you might want to implement a toast system)
  const showSuccessMessage = (message) => {
    // For now, we'll use a simple alert, but in a real app you'd use a toast library
    console.log("Success:", message);
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Handle opening new task form
  const handleNewTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + N for new task
      if ((e.ctrlKey || e.metaKey) && e.key === "n" && !showForm) {
        e.preventDefault();
        handleNewTask();
      }

      // Escape to close form
      if (e.key === "Escape" && showForm) {
        e.preventDefault();
        handleFormCancel();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showForm]);

  // Render pagination controls
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${
            i === pagination.currentPage ? "active" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="pagination-btn"
        >
          {pagination.totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="pagination-btn pagination-nav"
          title="Previous page"
        >
          ← Previous
        </button>

        {pages}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="pagination-btn pagination-nav"
          title="Next page"
        >
          Next →
        </button>
      </div>
    );
  };

  // Render task statistics
  const renderStats = () => (
    <div className="task-stats">
      <div className="stat-card total" onClick={() => clearFilters()}>
        <div className="stat-number">{stats.total || 0}</div>
        <div className="stat-label">Total Tasks</div>
        <div className="stat-icon">📊</div>
      </div>

      <div
        className="stat-card pending"
        onClick={() => handleFilterChange("status", TASK_STATUS.PENDING)}
      >
        <div className="stat-number">{stats.pending || 0}</div>
        <div className="stat-label">Pending</div>
        <div className="stat-icon">📋</div>
      </div>

      <div
        className="stat-card in-progress"
        onClick={() => handleFilterChange("status", TASK_STATUS.IN_PROGRESS)}
      >
        <div className="stat-number">{stats["in-progress"] || 0}</div>
        <div className="stat-label">In Progress</div>
        <div className="stat-icon">🔄</div>
      </div>

      <div
        className="stat-card completed"
        onClick={() => handleFilterChange("status", TASK_STATUS.COMPLETED)}
      >
        <div className="stat-number">{stats.completed || 0}</div>
        <div className="stat-label">Completed</div>
        <div className="stat-icon">✅</div>
      </div>
    </div>
  );

  // Render filter controls
  const renderFilters = () => (
    <div className="task-filters">
      <div className="filter-header">
        <h3>Filter & Search</h3>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="btn btn-small btn-outline btn-secondary"
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="filter-group search-group">
          <label className="filter-label">Search</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="form-control search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="form-control"
          >
            <option value="">All Status</option>
            <option value={TASK_STATUS.PENDING}>📋 Pending</option>
            <option value={TASK_STATUS.IN_PROGRESS}>🔄 In Progress</option>
            <option value={TASK_STATUS.COMPLETED}>✅ Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="form-control"
          >
            <option value="">All Priority</option>
            <option value={TASK_PRIORITY.HIGH}>🔴 High</option>
            <option value={TASK_PRIORITY.MEDIUM}>🟡 Medium</option>
            <option value={TASK_PRIORITY.LOW}>🟢 Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split("-");
              handleFilterChange("sortBy", sortBy);
              handleFilterChange("order", order);
            }}
            className="form-control"
          >
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={`${option.field}-${option.order}`}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.status && (
            <span className="filter-tag">
              Status: {filters.status}
              <button onClick={() => handleFilterChange("status", "")}>
                ×
              </button>
            </span>
          )}
          {filters.priority && (
            <span className="filter-tag">
              Priority: {filters.priority}
              <button onClick={() => handleFilterChange("priority", "")}>
                ×
              </button>
            </span>
          )}
          {filters.search && (
            <span className="filter-tag">
              Search: "{filters.search}"
              <button onClick={() => handleFilterChange("search", "")}>
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="tasks-container">
      {/* Header */}
      <div className="tasks-header">
        <div className="header-content">
          <h1>My Tasks</h1>
          <p className="header-subtitle">
            Organize and track your tasks efficiently
          </p>
        </div>

        <div className="header-actions">
          <button
            onClick={refreshData}
            className="btn btn-outline btn-secondary"
            disabled={isRefreshing}
            title="Refresh tasks (F5)"
          >
            {isRefreshing ? "🔄" : "↻"} Refresh
          </button>

          <button
            onClick={handleNewTask}
            className="btn btn-primary"
            title="Create new task (Ctrl/Cmd + N)"
          >
            ➕ Add New Task
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {renderStats()}

      {/* Filters */}
      {renderFilters()}

      {/* Error Message */}
      <ErrorMessage
        message={error}
        onRetry={() => loadTasks()}
        onDismiss={() => setError(null)}
      />

      {/* Task Form Modal */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleFormCancel();
            }
          }}
        >
          <div className="modal-content">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Task List Content */}
      {loading ? (
        <LoadingSpinner message="Loading your tasks..." />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>
            {hasActiveFilters()
              ? "No tasks match your filters"
              : "No tasks yet"}
          </h3>
          <p>
            {hasActiveFilters()
              ? "Try adjusting your filters or search terms to find what you're looking for."
              : "Create your first task to get started with organizing your work!"}
          </p>

          <div className="empty-actions">
            {hasActiveFilters() ? (
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-primary"
              >
                🗑️ Clear Filters
              </button>
            ) : (
              <button onClick={handleNewTask} className="btn btn-primary">
                ➕ Create Your First Task
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="results-summary">
            <span className="results-text">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalTasks
              )}{" "}
              of {pagination.totalTasks} task
              {pagination.totalTasks !== 1 ? "s" : ""}
              {hasActiveFilters() && " (filtered)"}
            </span>

            {isRefreshing && (
              <span className="refreshing-indicator">🔄 Refreshing...</span>
            )}
          </div>

          {/* Task List */}
          <div className="task-list">
            {tasks.map((task, index) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onUpdate={refreshData}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default TaskList;
