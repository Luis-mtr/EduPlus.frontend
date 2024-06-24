import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
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
    <div className="flex flex-col items-center mt-20 p-5">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="mb-2">New user? Please register below:</p>
          <button
            onClick={handleNavigateToRegister}
            className="py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
