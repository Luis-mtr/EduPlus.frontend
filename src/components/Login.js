import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import config from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth, setRole, setNativeLanguageId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Sanitize the inputs
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/account/login`,
        {
          UserName: sanitizedEmail,
          Password: sanitizedPassword,
        }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      setAuth(true);
      setRole(decodedToken.role);
      setNativeLanguageId(decodedToken.nativeLanguageId); // Ensure to set native language ID

      if (decodedToken.role === "Admin") {
        navigate("/upload");
      } else if (decodedToken.role === "User") {
        navigate("/statistics");
      } else {
        navigate("/user"); // Default fallback
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="page-content">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <div>
          <p>New user? Please register below:</p>
          <button onClick={handleNavigateToRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
