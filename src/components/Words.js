import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Words.css";
import NavBar from "./NavBar";

function Words() {
  const [languages, setLanguages] = useState([]);
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [wordLanguages, setWordLanguages] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5270/api/languages",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLanguages(response.data);
        setSelectedLanguage(response.data[0]?.languageId || null);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    const fetchWords = async () => {
      try {
        const response = await axios.get("http://localhost:5270/api/word", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWords(response.data);
        setFilteredWords(response.data); // Initialize filteredWords
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchLanguages();
    fetchWords();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      const fetchWordLanguages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5270/api/wordlanguage`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const wordLangMap = {};
          response.data.forEach((wl) => {
            wordLangMap[`${wl.wordId}_${wl.languageId}`] = wl;
          });
          setWordLanguages(wordLangMap);
        } catch (error) {
          console.error("Error fetching word languages:", error);
        }
      };

      fetchWordLanguages();
    }
  }, [selectedLanguage]);

  const handleInputChange = (e, wordId) => {
    const { value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [`${wordId}_${selectedLanguage}`]: value,
    }));
  };

  const handleSave = async (wordId) => {
    const key = `${wordId}_${selectedLanguage}`;
    const wordInLanguage = inputValues[key];

    try {
      await axios.post(
        "http://localhost:5270/api/wordlanguage",
        {
          wordId: wordId,
          languageId: selectedLanguage,
          wordLanguage: wordInLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Word created successfully");
      setWordLanguages((prevState) => ({
        ...prevState,
        [key]: { wordInLanguage: wordInLanguage },
      }));
      setInputValues((prev) => ({
        ...prev,
        [key]: "",
      }));
    } catch (error) {
      console.error("Error saving word:", error);
      alert("Failed to save word");
    }
  };

  const handleDelete = async (wordId) => {
    try {
      await axios.delete(
        `http://localhost:5270/api/wordlanguage/${wordId}/${selectedLanguage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWordLanguages((prev) => {
        const newState = { ...prev };
        delete newState[`${wordId}_${selectedLanguage}`];
        return newState;
      });
      alert("Word deleted successfully");
    } catch (error) {
      console.error("Error deleting word:", error);
      alert("Failed to delete word");
    }
  };

  const getWordInLanguage = (wordId) => {
    const key = `${wordId}_${selectedLanguage}`;
    return wordLanguages[key]?.wordInLanguage || "";
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    const filtered = words.filter((word) =>
      word.wordText.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredWords(filtered);
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
      <table className="words-table">
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
            <th>Word in Language</th>
            <th>Delete/Submit</th>
          </tr>
        </thead>
        <tbody>
          {filteredWords.map((word) => {
            const wordInLanguage = getWordInLanguage(word.wordId);
            const wordLangExists = Boolean(wordInLanguage);
            const key = `${word.wordId}_${selectedLanguage}`;
            const inputValue = inputValues[key] || "";

            return (
              <tr key={word.wordId}>
                <td>{word.wordText}</td>
                <td className="input-cell">
                  {wordLangExists ? (
                    <span>{wordInLanguage}</span>
                  ) : (
                    <input
                      type="text"
                      name="wordInLanguage"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e, word.wordId)}
                    />
                  )}
                </td>
                <td>
                  {wordLangExists ? (
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(word.wordId)}
                    >
                      ✖
                    </button>
                  ) : (
                    <button
                      className="submit-button"
                      onClick={() => handleSave(word.wordId)}
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

export default Words;
