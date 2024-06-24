import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import config from "../config";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
    <div className="flex flex-col items-center mt-20 p-5">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <label htmlFor="username" className="self-start text-lg font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="email" className="self-start text-lg font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="password" className="self-start text-lg font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="language" className="self-start text-lg font-medium">
            Native Language
          </label>
          <select
            id="language"
            value={selectedLanguageId}
            onChange={(e) => setSelectedLanguageId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((language) => (
              <option key={language.languageId} value={language.languageId}>
                {language.languageName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Register
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
