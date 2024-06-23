import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import config from "../config";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // New state for registration success

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/languages`);
        setLanguages(response.data);
        if (response.data.length > 0) {
          setSelectedLanguageId(response.data[0].languageId); // Set the default selected language
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Sanitize the inputs
    const sanitizedUsername = DOMPurify.sanitize(username);
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);

    try {
      await axios.post(`${config.apiBaseUrl}api/account/register`, {
        Email: sanitizedEmail,
        Password: sanitizedPassword,
        Username: sanitizedUsername,
        LanguageId: selectedLanguageId,
      });
      setRegistrationSuccess(true);
      alert("Registration successful");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  useEffect(() => {
    if (registrationSuccess) {
      navigate("/login");
    }
  }, [registrationSuccess, navigate]);

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="page-content">
      <div className="register-container">
        <h2>Register</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="language">Native Language</label>
        <select
          id="language"
          value={selectedLanguageId}
          onChange={(e) => setSelectedLanguageId(e.target.value)}
        >
          {languages.map((language) => (
            <option key={language.languageId} value={language.languageId}>
              {language.languageName}
            </option>
          ))}
        </select>
        <button type="submit" onClick={handleRegister}>
          Register
        </button>
        <button type="button" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
}

export default Register;
