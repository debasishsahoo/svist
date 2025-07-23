import React, { useState, useEffect } from "react";
import "./styles/status.css";

const StatusMessage = ({ type, message, showIcon = true }) => {
  const getStatusClass = () => {
    switch (type) {
      case "success":
        return "status-success";
      case "error":
        return "status-error";
      case "warning":
        return "status-warning";
      default:
        return "status-info";
    }
  };
  const getStatusIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };
  return (
    <div className={`status-message ${getStatusClass()}`}>
      {showIcon && <span className="icon">{getStatusIcon()}</span>}
      <span className="message">{message}</span>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState(null);
  const [status, setStatus] = useState({
    type: "info",
    message: "Loading users...",
  });

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/user")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API responded with error");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setStatus({ type: "warning", message: "No users found." });
        } else {
          setUsers(data);
          setStatus({ type: "success", message: "Users loaded successfully!" });
        }
      })
      .catch((error) => {
        setStatus({
          type: "error",
          message: `Error fetching users: ${error.message}`,
        });
      });
  }, []);

  return (
    <div>
      <StatusMessage type={status.type} message={status.message} />
      {users && (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};







const AdvancedPropsPatterns = () => {
  return (
    <div className="app-container">
      <h2>Advanced Props Patterns (with API Status)</h2>
      <UserList />
    </div>
  );
};

export default AdvancedPropsPatterns;
