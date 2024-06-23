import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Languages.css";
import NavBar from "./NavBar";
import config from "../config";

function Languages() {
  const [languages, setLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [searchLanguage, setSearchLanguage] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/languages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLanguages(response.data);
        setFilteredLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const filtered = languages.filter((language) =>
      language.languageName.toLowerCase().includes(searchLanguage.toLowerCase())
    );
    setFilteredLanguages(filtered);
  }, [searchLanguage, languages]);

  const handleDelete = async (languageId) => {
    if (window.confirm(`Are you sure you want to delete this language?`)) {
      try {
        await axios.delete(`${config.apiBaseUrl}api/languages/${languageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLanguages(
          languages.filter((language) => language.languageId !== languageId)
        );
      } catch (error) {
        console.error("Error deleting language:", error);
      }
    }
  };

  const handleInputChange = (e, languageId) => {
    const { name, value } = e.target;
    setLanguages(
      languages.map((language) =>
        language.languageId === languageId
          ? { ...language, [name]: value }
          : language
      )
    );
  };

  const handleUpdate = async (languageId) => {
    const language = languages.find(
      (language) => language.languageId === languageId
    );
    try {
      await axios.put(
        `${config.apiBaseUrl}api/languages/${languageId}`,
        {
          languageName: language.languageName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Language updated successfully");
    } catch (error) {
      console.error("Error updating language:", error);
      alert("Failed to update language");
    }
  };

  const handleAddLanguage = async () => {
    if (newLanguage.trim() === "") {
      alert("Please enter a language name");
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/languages`,
        {
          languageName: newLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLanguages([...languages, response.data]);
      setNewLanguage("");
    } catch (error) {
      console.error("Error adding language:", error);
      alert("Failed to add language");
    }
  };

  return (
    <div className="page-content">
      <NavBar />
      <table className="languages-table">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Search Language"
                value={searchLanguage}
                onChange={(e) => setSearchLanguage(e.target.value)}
              />
            </th>
            <th>Del.</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                placeholder="Insert new language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
              />
            </td>
            <td></td>
            <td>
              <button className="submit-button" onClick={handleAddLanguage}>
                ✔
              </button>
            </td>
          </tr>
          {filteredLanguages.map((language) => (
            <tr key={language.languageId}>
              <td>
                <input
                  type="text"
                  name="languageName"
                  value={language.languageName}
                  onChange={(e) => handleInputChange(e, language.languageId)}
                />
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(language.languageId)}
                >
                  X
                </button>
              </td>
              <td>
                <button
                  className="submit-button"
                  onClick={() => handleUpdate(language.languageId)}
                >
                  ✔
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Languages;
