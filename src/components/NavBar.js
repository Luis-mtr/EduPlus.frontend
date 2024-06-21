import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? "nav-button active" : "nav-button";
  };

  const handleLogout = () => {
    // Clear local storage or any other stored data
    localStorage.removeItem("token");
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div className="nav-bar">
      <Link to="/accounts" className={isActive("/accounts")}>
        Accounts
      </Link>
      <Link to="/languages" className={isActive("/languages")}>
        Languages
      </Link>
      <Link to="/phrases" className={isActive("/phrases")}>
        Phrases
      </Link>
      <Link to="/words" className={isActive("/words")}>
        Words
      </Link>
      <Link to="/upload" className={isActive("/upload")}>
        Upload
      </Link>
      <button className="nav-button logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default NavBar;
