import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Phrases.css";
import NavBar from "./NavBar";
import config from "../config";

function Phrases() {
  const [languages, setLanguages] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [filteredPhrases, setFilteredPhrases] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [phraseLanguages, setPhraseLanguages] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/languages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLanguages(response.data);
        setSelectedLanguage(response.data[0]?.languageId || null);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    const fetchPhrases = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/phrase`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPhrases(response.data);
        setFilteredPhrases(response.data); // Initialize filteredPhrases
      } catch (error) {
        console.error("Error fetching phrases:", error);
      }
    };

    fetchLanguages();
    fetchPhrases();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      const fetchPhraseLanguages = async () => {
        try {
          const response = await axios.get(
            `${config.apiBaseUrl}/api/phraselanguage`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const phraseLangMap = {};
          response.data.forEach((pl) => {
            phraseLangMap[`${pl.phraseId}_${pl.languageId}`] = pl;
          });
          setPhraseLanguages(phraseLangMap);
        } catch (error) {
          console.error("Error fetching phrase languages:", error);
        }
      };

      fetchPhraseLanguages();
    }
  }, [selectedLanguage]);

  const handleInputChange = (e, phraseId) => {
    const { value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [`${phraseId}_${selectedLanguage}`]: value,
    }));
  };

  const handleSave = async (phraseId) => {
    const key = `${phraseId}_${selectedLanguage}`;
    const phraseInLanguage = inputValues[key];

    try {
      await axios.post(
        `${config.apiBaseUrl}/api/phraselanguage`,
        {
          phraseId: phraseId,
          languageId: selectedLanguage,
          phraseLanguage: phraseInLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Phrase created successfully");
      setPhraseLanguages((prevState) => ({
        ...prevState,
        [key]: { phraseInLanguage: phraseInLanguage },
      }));
      setInputValues((prev) => ({
        ...prev,
        [key]: "",
      }));
    } catch (error) {
      console.error("Error saving phrase:", error);
      alert("Failed to save phrase");
    }
  };

  const handleDelete = async (phraseId) => {
    try {
      await axios.delete(
        `${config.apiBaseUrl}/api/phraselanguage/${phraseId}/${selectedLanguage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPhraseLanguages((prev) => {
        const newState = { ...prev };
        delete newState[`${phraseId}_${selectedLanguage}`];
        return newState;
      });
      alert("Phrase deleted successfully");
    } catch (error) {
      console.error("Error deleting phrase:", error);
      alert("Failed to delete phrase");
    }
  };

  const getPhraseInLanguage = (phraseId) => {
    const key = `${phraseId}_${selectedLanguage}`;
    return phraseLanguages[key]?.phraseInLanguage || "";
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    const filtered = phrases.filter((phrase) =>
      phrase.phraseText.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPhrases(filtered);
  };

  return (
    <div className="page-content">
      <NavBar />
      <div className="language-selector">
        <label htmlFor="language-select">Select a language:</label>
        <select
          id="language-select"
          value={selectedLanguage || ""}
          onChange={(e) => setSelectedLanguage(parseInt(e.target.value))}
        >
          {languages.map((language) => (
            <option key={language.languageId} value={language.languageId}>
              {language.languageName}
            </option>
          ))}
        </select>
      </div>
      <table className="phrases-table">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </th>
            <th>Phrase in Language</th>
            <th>Delete/Submit</th>
          </tr>
        </thead>
        <tbody>
          {filteredPhrases.map((phrase) => {
            const phraseInLanguage = getPhraseInLanguage(phrase.phraseId);
            const phraseLangExists = Boolean(phraseInLanguage);
            const key = `${phrase.phraseId}_${selectedLanguage}`;
            const inputValue = inputValues[key] || "";

            return (
              <tr key={phrase.phraseId}>
                <td>{phrase.phraseText}</td>
                <td className="input-cell">
                  {phraseLangExists ? (
                    <span>{phraseInLanguage}</span>
                  ) : (
                    <input
                      type="text"
                      name="phraseInLanguage"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e, phrase.phraseId)}
                    />
                  )}
                </td>
                <td>
                  {phraseLangExists ? (
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(phrase.phraseId)}
                    >
                      ✖
                    </button>
                  ) : (
                    <button
                      className="submit-button"
                      onClick={() => handleSave(phrase.phraseId)}
                    >
                      ✔
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Phrases;
