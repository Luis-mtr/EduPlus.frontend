import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import { AuthContext } from "../context/AuthContext";
import config from "../config";

function Sidebar() {
  const [languages, setLanguages] = useState([]);
  const {
    nativeLanguageId,
    setAuth,
    setRole,
    setNativeLanguageId,
    totalPoints,
  } = useContext(AuthContext); // Get native language ID and context setters
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/languages`);
        const allLanguages = response.data;
        if (nativeLanguageId !== null) {
          const filteredLanguages = allLanguages.filter(
            (language) => language.languageId !== parseInt(nativeLanguageId)
          );
          setLanguages(filteredLanguages);
        } else {
          setLanguages(allLanguages);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, [nativeLanguageId]);

  const isActive = (path) => {
    return location.pathname === path
      ? "sidebar-button active"
      : "sidebar-button";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setRole(null);
    setNativeLanguageId(null);
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <Link to="/statistics" className={isActive("/statistics")}>
        Statistics
      </Link>
      <Link to="/leaderboards" className={isActive("/leaderboards")}>
        Leaderboards
      </Link>
      <button onClick={handleLogout} className="sidebar-button">
        Logout
      </button>
      <div className="total-points">
        <p>Total Points</p>
        <p>{totalPoints}</p>
      </div>
      <div className="submenu">
        <p>Learn</p>
        {languages.map((language) => (
          <Link
            key={language.languageId}
            to={`/question/${language.languageId}`}
            className="sidebar-button"
          >
            {language.languageName}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
