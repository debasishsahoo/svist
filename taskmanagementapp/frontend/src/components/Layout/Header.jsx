import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Layout.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header>
      <div>
        <Link to="/" className="logo">
          <h1>Task Manager</h1>
        </Link>
        <nav className="nav">
          {user ? (
            <div className="nav-user">
              <span className="welcome-text">Welcome, {user.name}</span>
              <Link to="/tasks" className="nav-link">
                Tasks
              </Link>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
