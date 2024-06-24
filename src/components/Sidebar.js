import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import config from "../config";
import { useSidebar } from "../context/SidebarContext";

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
  const { isSidebarOpen, toggleSidebar } = useSidebar(); // Use sidebar context

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
      ? "bg-blue-500 text-white"
      : "text-gray-200 hover:bg-gray-700";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setRole(null);
    setNativeLanguageId(null);
    navigate("/login");
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 bg-blue-500 text-white py-2 px-4 rounded z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "Close" : "Open"} Sidebar
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 p-5 flex flex-col items-start transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-48 z-40 pt-16`} // Changed to w-48 for a narrower sidebar
      >
        <div className="mb-4 text-blue-400">
          <p className="font-bold">Total Points</p>
          <p className="text-2xl">{totalPoints}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold text-blue-400 mb-2">Learn</p>
          <div className="bg-gray-700 p-2 rounded w-full">
            {languages.map((language) => (
              <Link
                key={language.languageId}
                to={`/question/${language.languageId}`}
                className={`block py-2 px-4 rounded my-1 ${isActive(
                  `/question/${language.languageId}`
                )}`}
              >
                {language.languageName}
              </Link>
            ))}
          </div>
        </div>
        <Link
          to="/statistics"
          className={`block py-2 px-4 rounded my-1 ${isActive("/statistics")}`}
        >
          Statistics
        </Link>
        <Link
          to="/leaderboards"
          className={`block py-2 px-4 rounded my-1 ${isActive(
            "/leaderboards"
          )}`}
        >
          Leaderboards
        </Link>
        <button
          onClick={handleLogout}
          className="block py-2 px-4 rounded my-1 text-gray-200 hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
