import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5270/api/account/login",
        {
          UserName: email,
          Password: password,
        }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      setAuth(true);
      setRole(decodedToken.role);
      if (decodedToken.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div>
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
  );
}

export default Login;
