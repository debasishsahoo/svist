import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>TaskManager</h1>
          </Link>

          <nav className="nav">
            {user ? (
              <div className="nav-user">
                <span className="user-welcome">
                  Welcome, {user.username}!
                </span>
                <Link to="/tasks" className="nav-link">
                  My Tasks
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-auth">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
