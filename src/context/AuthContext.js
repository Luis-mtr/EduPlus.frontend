import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [nativeLanguageId, setNativeLanguageId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuth(true);
      setRole(decodedToken.role);
      setNativeLanguageId(decodedToken.nativeLanguageId); // Ensure to set native language ID
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        role,
        setRole,
        nativeLanguageId,
        setNativeLanguageId,
      }} // Add setNativeLanguageId here
    >
      {children}
    </AuthContext.Provider>
  );
};
