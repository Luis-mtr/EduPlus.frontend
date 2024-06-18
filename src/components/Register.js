import React, { useState, useEffect } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("http://localhost:5270/api/languages");
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
    try {
      await axios.post("http://localhost:5270/api/account/register", {
        Email: email,
        Password: password,
        Username: username,
        LanguageId: selectedLanguageId,
      });
      alert("Registration successful");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        value={selectedLanguageId}
        onChange={(e) => setSelectedLanguageId(e.target.value)}
      >
        {languages.map((language) => (
          <option key={language.languageId} value={language.languageId}>
            {language.languageName}
          </option>
        ))}
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
