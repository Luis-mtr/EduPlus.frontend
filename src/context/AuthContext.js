import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [nativeLanguageId, setNativeLanguageId] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0); // Initialize totalPoints with 0

  useEffect(() => {
    const fetchTotalPoints = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/score`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTotalPoints(response.data.addPoints);
      } catch (error) {
        console.error("Error fetching total points:", error);
      }
    };

    if (auth) {
      fetchTotalPoints();
    }
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        role,
        setRole,
        nativeLanguageId,
        setNativeLanguageId,
        totalPoints,
        setTotalPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
