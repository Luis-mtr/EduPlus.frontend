import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "nav-button active" : "nav-button";
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
    </div>
  );
}

export default NavBar;
