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
            {user?():()}
        </nav>
      </div>
    </header>
  );
};

export default Header;
