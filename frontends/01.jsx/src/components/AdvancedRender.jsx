import React from "react";

const AdvancedRender = () => {
  const isLoggedIn = false;
  const hasNotifications = false;
  const notificationCount = 5;
  return (
    <div>
      <h1>My App</h1>
      {isLoggedIn ? (
        <div className="user-menu">
          <span>Welcome back!</span>
          <button>Logout</button>
          {hasNotifications && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>
      ) : (
        <div className="auth-buttons">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default AdvancedRender;
