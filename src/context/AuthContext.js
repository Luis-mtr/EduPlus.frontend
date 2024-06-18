import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuth(true);
      setRole(decodedToken.role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
